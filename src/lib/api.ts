/**
 * API client for the Sentinel backend (Cloudflare Worker).
 * All requests use the Supabase JWT as Bearer token.
 */

import type {
  Endpoint,
  RawEvent,
  TransformationRule,
  DLQEvent,
  EventsListResponse,
  ApiResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

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

async function getToken(): Promise<string | null> {
  // Dynamic import so this works in both client and server contexts
  if (typeof window !== 'undefined') {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }
  return null;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    return { error: text || `HTTP ${res.status}` };
  }

  const data = await res.json();
  return { data };
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function listEndpoints(): Promise<Endpoint[]> {
  const res = await apiFetch<Endpoint[] | { data: Endpoint[]; count?: number }>('/api/endpoints');
  return unwrapListPayload<Endpoint>(res.data);
}

export async function getEndpoint(id: string): Promise<Endpoint | null> {
  const res = await apiFetch<Endpoint>(`/api/endpoints/${id}`);
  return res.data ?? null;
}

export async function createEndpoint(
  body: Omit<Endpoint, 'id' | 'tenant_id' | 'slug' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Endpoint>> {
  return apiFetch<Endpoint>('/api/endpoints', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteEndpoint(id: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/api/endpoints/${id}`, { method: 'DELETE' });
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
  if ('events' in body && Array.isArray(body.events)) return body;
  if ('data' in body && Array.isArray((body as { data: RawEvent[] }).data)) {
    const b = body as { data: RawEvent[]; total: number; limit: number; offset: number };
    return { events: b.data, total: b.total, limit: b.limit, offset: b.offset };
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

export async function listRules(endpointId: string): Promise<TransformationRule[]> {
  const res = await apiFetch<
    TransformationRule[] | { data: TransformationRule[]; count?: number }
  >(`/api/endpoints/${endpointId}/rules`);
  return unwrapListPayload<TransformationRule>(res.data);
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
  const res = await apiFetch<DLQEvent[] | { data: DLQEvent[]; total?: number }>('/api/dlq');
  return unwrapListPayload<DLQEvent>(res.data);
}

export async function reinjectDLQEvent(
  dlqId: string,
  correctedPayload?: Record<string, unknown>
): Promise<ApiResponse<{ status: string }>> {
  return apiFetch<{ status: string }>(`/api/dlq/${dlqId}/reinject`, {
    method: 'POST',
    body: JSON.stringify({ correctedPayload }),
  });
}

export async function discardDLQEvent(dlqId: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/api/dlq/${dlqId}`, { method: 'DELETE' });
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
