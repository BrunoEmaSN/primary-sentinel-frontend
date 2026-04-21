/**
 * API client for the Sentinel backend (Cloudflare Worker).
 * Uses the Supabase access JWT as Bearer. On 401, calls refreshSession once and retries.
 */

import type { Destination } from '@/types/destinations';
import type {
  Endpoint,
  EndpointStatus,
  RawEvent,
  TransformationRule,
  DLQEvent,
  EventsListResponse,
  ApiResponse,
  CreateEndpointResponse,
} from '@/types';
import { LOCALE_COOKIE, type Locale, isLocale } from '@/lib/i18n/types';

/**
 * URL pública del Worker (webhooks, documentación). No usar para fetch del dashboard:
 * esas peticiones van por mismo origen `/worker-api` (rewrites en next.config.mjs).
 */
export function getPublicWorkerUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8787').replace(/\/$/, '');
}

/** Base URL para fetch desde el navegador: mismo origen + proxy → Worker (sin CORS). */
function getBrowserApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/worker-api`;
  }
  const v = process.env.VERCEL_URL;
  if (v) return `https://${v}/worker-api`;
  const port = process.env.PORT || '3000';
  return `http://127.0.0.1:${port}/worker-api`;
}

/** Backend list routes return `{ data: T[], ... }`; unwrap to `T[]`. */
function unwrapListPayload<T>(body: unknown): T[] {
  if (body == null) return [];
  if (Array.isArray(body)) return body as T[];
  if (typeof body === 'object' && 'data' in body) {
    const d = (body as { data: unknown }).data;
    if (Array.isArray(d)) return d as T[];
  }
  return [];
}

/** GET /api/dlq devuelve `RawEvent.toSnapshot()` (camelCase); lo adaptamos a `DLQEvent`. */
function normalizeDlqRow(row: Record<string, unknown>): DLQEvent {
  const id = String(row.id ?? '');
  const created =
    (typeof row.createdAt === 'string' && row.createdAt) ||
    (typeof row.created_at === 'string' && row.created_at) ||
    new Date().toISOString();

  const raw = row.rawPayload !== undefined ? row.rawPayload : row.payload;
  const payload: Record<string, unknown> =
    raw !== null && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const log = row.errorLog;
  const errorLog = Array.isArray(log) ? log.filter((e): e is string => typeof e === 'string') : [];
  const error_reason =
    errorLog.length > 0
      ? errorLog[errorLog.length - 1]!
      : typeof row.error_reason === 'string'
        ? row.error_reason
        : 'Payload con estructura desconocida';

  const attempts =
    typeof row.healingAttempts === 'number'
      ? row.healingAttempts
      : typeof row.attempts === 'number'
        ? row.attempts
        : 0;

  return {
    id,
    event_id: id,
    endpoint_id: String(row.endpointId ?? row.endpoint_id ?? ''),
    tenant_id: String(row.tenantId ?? row.tenant_id ?? ''),
    payload,
    error_reason,
    attempts,
    notified: typeof row.notified === 'boolean' ? row.notified : false,
    created_at: created,
  };
}

/** Alineado con la cookie del `I18nProvider` para que el Worker traduzca mensajes. */
function getBrowserApiLocale(): Locale {
  if (typeof document === 'undefined') return 'es';
  const escaped = LOCALE_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  const raw = match?.[1] ? decodeURIComponent(match[1]) : '';
  return isLocale(raw) ? raw : 'es';
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** One refresh attempt; returns new access token or null. */
async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  const { data } = await supabase.auth.refreshSession();
  return data.session?.access_token ?? null;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${getBrowserApiBaseUrl()}${path}`;
  const token = await getAccessToken();

  const lang = getBrowserApiLocale();

  const doFetch = (accessToken: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Sentinel-Locale': lang,
        'Accept-Language': lang === 'en' ? 'en,es;q=0.5' : 'es,en;q=0.5',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });

  let res: Response;
  try {
    res = await doFetch(token);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Error de red',
    };
  }

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      try {
        res = await doFetch(newToken);
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : 'Error de red',
        };
      }
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    return { error: text || `HTTP ${res.status}` };
  }

  const data = await res.json();
  return { data };
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

function pickDestinations(row: Record<string, unknown>): Destination[] {
  if (Array.isArray(row.destinations) && row.destinations.length > 0) {
    return row.destinations as Destination[];
  }
  const d = row.destination;
  if (d == null) return [];
  if (Array.isArray(d)) return d as Destination[];
  if (typeof d === 'object') return [d as Destination];
  return [];
}

function normalizeEndpoint(row: Record<string, unknown>): Endpoint {
  const destinations = pickDestinations(row);
  const hc = row.healingConfig ?? row.healing_config;
  const healingObj =
    hc !== null && typeof hc === 'object' && !Array.isArray(hc)
      ? (hc as Record<string, unknown>)
      : {};

  const created =
    (typeof row.created_at === 'string' && row.created_at) ||
    (typeof row.createdAt === 'string' && row.createdAt) ||
    new Date().toISOString();
  const updated =
    (typeof row.updated_at === 'string' && row.updated_at) ||
    (typeof row.updatedAt === 'string' && row.updatedAt) ||
    created;

  const rawStatus = row.status;
  const status: EndpointStatus =
    rawStatus === 'paused' || rawStatus === 'error' || rawStatus === 'active'
      ? rawStatus
      : 'active';

  return {
    id: String(row.id ?? ''),
    tenant_id: String(row.tenant_id ?? row.tenantId ?? ''),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    schema:
      row.schema !== null && typeof row.schema === 'object' && !Array.isArray(row.schema)
        ? (row.schema as Record<string, unknown>)
        : {},
    destinations,
    destination: destinations.length === 1 ? destinations[0] : destinations,
    healingConfig: {
      enabled: Boolean(healingObj.enabled ?? true),
      maxAttempts: Number(healingObj.maxAttempts ?? healingObj.max_attempts ?? 3),
      autoApplyRules: Boolean(healingObj.autoApplyRules ?? healingObj.auto_apply_rules ?? true),
      notifyOnHealing: Boolean(healingObj.notifyOnHealing ?? healingObj.notify_on_healing ?? true),
      notifyOnDead: Boolean(healingObj.notifyOnDead ?? healingObj.notify_on_dead ?? true),
    },
    status,
    webhook_secret: typeof row.webhook_secret === 'string' ? row.webhook_secret : undefined,
    created_at: created,
    updated_at: updated,
  };
}

export async function listEndpoints(): Promise<Endpoint[]> {
  const res = await apiFetch<Endpoint[] | { data: Record<string, unknown>[]; count?: number }>(
    '/api/endpoints'
  );
  const raw = unwrapListPayload<Record<string, unknown>>(res.data);
  return raw.map(normalizeEndpoint);
}

export async function getEndpoint(id: string): Promise<Endpoint | null> {
  const res = await apiFetch<Record<string, unknown>>(`/api/endpoints/${id}`);
  const row = res.data;
  if (!row) return null;
  return normalizeEndpoint(row);
}

export async function createEndpoint(
  body: Omit<
    Endpoint,
    | 'id'
    | 'tenant_id'
    | 'slug'
    | 'created_at'
    | 'updated_at'
    | 'destinations'
    | 'destination'
    | 'status'
  > & {
    destination?: Destination | Destination[];
    destinations?: Destination[];
  }
): Promise<ApiResponse<CreateEndpointResponse>> {
  return apiFetch<CreateEndpointResponse>('/api/endpoints', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteEndpoint(id: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/api/endpoints/${id}`, { method: 'DELETE' });
}

/** Worker devuelve `toSnapshot()` en camelCase; el UI espera snake_case. */
function normalizeRawEvent(e: Record<string, unknown>): RawEvent {
  const created =
    (typeof e.created_at === 'string' && e.created_at) ||
    (typeof e.createdAt === 'string' && e.createdAt) ||
    new Date().toISOString();
  const updated =
    (typeof e.updated_at === 'string' && e.updated_at) ||
    (typeof e.updatedAt === 'string' && e.updatedAt) ||
    created;

  const logs = e.errorLog;
  const errorFromLog =
    Array.isArray(logs) && logs.length > 0 ? (logs as string[]).join('\n') : undefined;

  return {
    id: String(e.id ?? ''),
    endpoint_id: String(e.endpoint_id ?? e.endpointId ?? ''),
    tenant_id: String(e.tenant_id ?? e.tenantId ?? ''),
    status: e.status as RawEvent['status'],
    payload: (e.payload ?? e.rawPayload ?? {}) as Record<string, unknown>,
    healed_payload: (e.healed_payload ?? e.validatedPayload) as Record<string, unknown> | undefined,
    rule_id: (e.rule_id ?? e.transformationRuleId) as string | undefined,
    error_message: typeof e.error_message === 'string' ? e.error_message : errorFromLog,
    attempts: Number(e.attempts ?? e.healingAttempts ?? 0),
    created_at: created,
    updated_at: updated,
  };
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function listEvents(
  endpointId: string,
  params: { status?: string; limit?: number; offset?: number } = {}
): Promise<EventsListResponse> {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.offset) qs.set('offset', String(params.offset));

  const res = await apiFetch<
    EventsListResponse | { data: RawEvent[]; total: number; limit: number; offset: number }
  >(`/api/endpoints/${endpointId}/events?${qs}`);
  const body = res.data;
  if (!body) return { events: [], total: 0, limit: 20, offset: 0 };
  if ('events' in body && Array.isArray(body.events)) {
    return {
      ...body,
      events: body.events.map((ev) => normalizeRawEvent(ev as unknown as Record<string, unknown>)),
    };
  }
  if ('data' in body && Array.isArray((body as { data: RawEvent[] }).data)) {
    const b = body as { data: RawEvent[]; total: number; limit: number; offset: number };
    return {
      events: b.data.map((ev) => normalizeRawEvent(ev as unknown as Record<string, unknown>)),
      total: b.total,
      limit: b.limit,
      offset: b.offset,
    };
  }
  return { events: [], total: 0, limit: 20, offset: 0 };
}

export async function listAllEvents(
  params: { status?: string; limit?: number } = {}
): Promise<RawEvent[]> {
  // Fetch events across all endpoints
  const endpoints = await listEndpoints();
  const all: RawEvent[] = [];
  await Promise.all(
    endpoints.map(async (ep) => {
      const r = await listEvents(ep.id, params);
      all.push(...r.events);
    })
  );
  return all.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// ─── Rules ────────────────────────────────────────────────────────────────────

/** Worker devuelve `TransformationRule.toSnapshot()` (camelCase); el UI usa snake_case. */
function normalizeTransformationRule(row: Record<string, unknown>): TransformationRule {
  const created =
    (typeof row.created_at === 'string' && row.created_at) ||
    (typeof row.createdAt === 'string' && row.createdAt) ||
    new Date().toISOString();
  const updated =
    (typeof row.updated_at === 'string' && row.updated_at) ||
    (typeof row.updatedAt === 'string' && row.updatedAt) ||
    created;

  const description = typeof row.description === 'string' ? row.description : '';
  const fp =
    (typeof row.errorFingerprint === 'string' && row.errorFingerprint) ||
    (typeof row.fingerprint === 'string' && row.fingerprint) ||
    '';

  const generatedBy = typeof row.generatedBy === 'string' ? row.generatedBy : '';
  const source: TransformationRule['source'] =
    /^(human|manual)$/i.test(generatedBy) ? 'human' : 'ai';

  const rawStatus = String(row.status ?? 'active');
  const status: TransformationRule['status'] =
    rawStatus === 'deprecated'
      ? 'inactive'
      : rawStatus === 'pending' ||
          rawStatus === 'active' ||
          rawStatus === 'quarantined' ||
          rawStatus === 'inactive'
        ? (rawStatus as TransformationRule['status'])
        : 'active';

  const name =
    (typeof row.name === 'string' && row.name) ||
    (description.trim().length > 0 ? description.split('\n')[0]!.slice(0, 80) : fp.slice(0, 32) || 'Regla');

  return {
    id: String(row.id ?? ''),
    endpoint_id: String(row.endpoint_id ?? row.endpointId ?? ''),
    tenant_id: String(row.tenant_id ?? row.tenantId ?? ''),
    name,
    description: description || undefined,
    fingerprint: fp,
    script: typeof row.script === 'string' ? row.script : '',
    source,
    status,
    confidence: typeof row.confidence === 'number' ? row.confidence : undefined,
    success_count: Number(row.success_count ?? row.successCount ?? 0),
    failure_count: Number(row.failure_count ?? row.failureCount ?? 0),
    created_at: created,
    updated_at: updated,
  };
}

export async function listRules(endpointId: string): Promise<TransformationRule[]> {
  const res = await apiFetch<
    TransformationRule[] | { data: TransformationRule[]; count?: number }
  >(`/api/endpoints/${endpointId}/rules`);
  const raw = unwrapListPayload<Record<string, unknown>>(res.data).filter(
    (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r)
  );
  return raw.map(normalizeTransformationRule);
}

export async function listAllRules(): Promise<TransformationRule[]> {
  const endpoints = await listEndpoints();
  const all: TransformationRule[] = [];
  await Promise.all(
    endpoints.map(async (ep) => {
      const rules = await listRules(ep.id);
      all.push(...rules);
    })
  );
  return all;
}

export async function updateRule(
  endpointId: string,
  ruleId: string,
  body: Partial<TransformationRule>
): Promise<ApiResponse<TransformationRule>> {
  return apiFetch<TransformationRule>(
    `/api/endpoints/${endpointId}/rules/${ruleId}`,
    { method: 'PATCH', body: JSON.stringify(body) }
  );
}

export async function deleteRule(
  endpointId: string,
  ruleId: string
): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/api/endpoints/${endpointId}/rules/${ruleId}`, {
    method: 'DELETE',
  });
}

// ─── DLQ ──────────────────────────────────────────────────────────────────────

export async function listDLQ(): Promise<DLQEvent[]> {
  const res = await apiFetch<unknown[] | { data: unknown[]; total?: number }>('/api/dlq');
  const rows = unwrapListPayload<unknown>(res.data).filter(
    (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r)
  );
  return rows.map(normalizeDlqRow);
}

export async function reinjectDLQEvent(
  dlqId: string,
  correctedPayload?: Record<string, unknown>,
  options?: { snapshotName?: string }
): Promise<ApiResponse<{ status: string; message?: string; newEventId?: string }>> {
  return apiFetch<{ status: string; message?: string; newEventId?: string }>(
    `/api/dlq/${dlqId}/reinject`,
    {
      method: 'POST',
      body: JSON.stringify({
        correctedPayload,
        ...(options?.snapshotName ? { snapshotName: options.snapshotName } : {}),
      }),
    }
  );
}

export async function discardDLQEvent(dlqId: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/api/dlq/${dlqId}`, { method: 'DELETE' });
}

export async function listDlqSnapshots(eventId: string): Promise<ApiResponse<{ data: unknown[] }>> {
  return apiFetch<{ data: unknown[] }>(`/api/dlq/${eventId}/snapshots`);
}

export type DlqDiffResponse = {
  snapshotId: string;
  eventId: string;
  left: unknown;
  right: unknown;
  sameJson: boolean;
};

export async function getDlqDiff(
  eventId: string,
  snapshotId: string
): Promise<ApiResponse<DlqDiffResponse>> {
  return apiFetch<DlqDiffResponse>(
    `/api/dlq/${eventId}/diff?snapshotId=${encodeURIComponent(snapshotId)}`
  );
}

// ─── Settings & billing ───────────────────────────────────────────────────────

export type TenantSettingsApi = {
  notify_email_healing: boolean;
  notify_email_dead: boolean;
  notify_email_pending_rules: boolean;
  slack_on_incidents: boolean;
  slack_incoming_webhook_url: string | null;
  alert_webhook_url: string | null;
  alert_webhook_secret: string | null;
  billing_plan: string;
};

export async function getTenantSettings(): Promise<ApiResponse<TenantSettingsApi>> {
  return apiFetch<TenantSettingsApi>('/api/settings');
}

export async function putTenantSettings(
  body: Partial<TenantSettingsApi>
): Promise<ApiResponse<{ saved: boolean }>> {
  return apiFetch<{ saved: boolean }>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function updateEndpoint(
  id: string,
  body: Record<string, unknown>
): Promise<ApiResponse<Record<string, unknown>>> {
  return apiFetch<Record<string, unknown>>(`/api/endpoints/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function getBillingStatus(): Promise<
  ApiResponse<{ plan: string; stripeCustomerId: string | null; portalUrl: string | null; note?: string }>
> {
  return apiFetch('/api/billing/status');
}

export type PublicPricingCatalog = {
  plans: Array<{
    planKey: string;
    sortOrder: number;
    monthlyUsd: number;
    yearlyPerMonthUsd: number;
    currency: string;
    floorMonthlyUsd?: number;
    floorYearlyPerMonthUsd?: number;
  }>;
  discounts: Array<{
    code: string;
    label: string;
    description: string | null;
    percentOff: number;
    billingPeriod: string;
    appliesToPlanKeys: string[] | null;
    eligibility: Record<string, unknown>;
  }>;
  yearlyCommitmentSavingsPercent: number | null;
};

/** Público: sin JWT. Precios y promociones desde la base (Worker). */
export async function getPublicPricing(): Promise<ApiResponse<PublicPricingCatalog>> {
  const url = `${getBrowserApiBaseUrl()}/api/public/pricing`;
  const lang = typeof window !== 'undefined' ? getBrowserApiLocale() : 'es';
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Sentinel-Locale': lang,
        'Accept-Language': lang === 'en' ? 'en,es;q=0.5' : 'es,en;q=0.5',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error');
      return { error: text || `HTTP ${res.status}` };
    }
    const data = (await res.json()) as PublicPricingCatalog;
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}

// ─── Operations & métricas ────────────────────────────────────────────────────

export async function getDependencyGraph(): Promise<
  ApiResponse<{ nodes: unknown[]; edges: { from: string; to: string; label: string }[] }>
> {
  return apiFetch('/api/operations/dependency-graph');
}

export async function getAiHistory(limit = 40): Promise<ApiResponse<{ data: unknown[] }>> {
  return apiFetch<{ data: unknown[] }>(`/api/operations/ai-history?limit=${limit}`);
}

export async function getStageMetrics(hours = 24): Promise<ApiResponse<{ data: unknown[]; hours: number }>> {
  return apiFetch<{ data: unknown[]; hours: number }>(`/api/metrics/stages?hours=${hours}`);
}

export async function getHeuristicSuggestions(): Promise<
  ApiResponse<{ suggestions: { id: string; text: string; severity: string }[]; basedOnSamples: number }>
> {
  return apiFetch('/api/suggestions/heuristics');
}

export async function listEventNotes(eventId: string): Promise<ApiResponse<{ data: unknown[] }>> {
  return apiFetch<{ data: unknown[] }>(`/api/events/${eventId}/notes`);
}

export async function addEventNote(
  eventId: string,
  body: string
): Promise<ApiResponse<{ created: boolean }>> {
  return apiFetch<{ created: boolean }>(`/api/events/${eventId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function addEventTag(
  eventId: string,
  tag: string
): Promise<ApiResponse<{ saved: boolean }>> {
  return apiFetch<{ saved: boolean }>(`/api/events/${eventId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tag }),
  });
}

export async function listMaintenanceWindows(): Promise<ApiResponse<{ data: unknown[] }>> {
  return apiFetch<{ data: unknown[] }>('/api/maintenance-windows');
}

export async function createMaintenanceWindow(body: Record<string, unknown>): Promise<ApiResponse<unknown>> {
  return apiFetch('/api/maintenance-windows', { method: 'POST', body: JSON.stringify(body) });
}

export async function approveMaintenanceWindow(id: string): Promise<ApiResponse<{ approved: boolean }>> {
  return apiFetch<{ approved: boolean }>(`/api/maintenance-windows/${id}/approve`, { method: 'POST' });
}

/** Público: sin JWT (SLO declarado por el backend). */
export async function getPublicSlo(): Promise<{
  availabilityTargetPercent: number;
  firstUsefulAlertGoalMinutes: number;
  note: string;
  measured: boolean;
} | null> {
  const lang = typeof window !== 'undefined' ? getBrowserApiLocale() : 'es';
  try {
    const res = await fetch(`${getBrowserApiBaseUrl()}/api/public/slo`, {
      headers: {
        'X-Sentinel-Locale': lang,
        'Accept-Language': lang === 'en' ? 'en,es;q=0.5' : 'es,en;q=0.5',
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as {
      availabilityTargetPercent: number;
      firstUsefulAlertGoalMinutes: number;
      note: string;
      measured: boolean;
    };
  } catch {
    return null;
  }
}

// ─── Webhook test ─────────────────────────────────────────────────────────────

export async function sendTestWebhook(
  tenantId: string,
  endpointSlug: string,
  payload: Record<string, unknown>
): Promise<ApiResponse<{ eventId: string; status: string; message: string }>> {
  return apiFetch(`/webhook/${tenantId}/${endpointSlug}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
