// Mirrors backend domain models

export type EventStatus = 'loaded' | 'healed' | 'dead' | 'processing';
export type RuleStatus = 'active' | 'pending' | 'quarantined' | 'inactive';
export type RuleSource = 'ai' | 'human';
export type DestinationType = 'supabase' | 'webhook' | 'bigquery';

export interface Endpoint {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  schema: Record<string, unknown>;
  destination: {
    type: DestinationType;
    tableName?: string;
    url?: string;
  };
  healingConfig: {
    enabled: boolean;
    maxAttempts: number;
    autoApplyRules: boolean;
    notifyOnHealing: boolean;
    notifyOnDead: boolean;
  };
  webhook_secret?: string;
  created_at: string;
  updated_at: string;
}

export interface RawEvent {
  id: string;
  endpoint_id: string;
  tenant_id: string;
  status: EventStatus;
  payload: Record<string, unknown>;
  healed_payload?: Record<string, unknown>;
  rule_id?: string;
  error_message?: string;
  attempts: number;
  created_at: string;
  updated_at: string;
}

export interface TransformationRule {
  id: string;
  endpoint_id: string;
  tenant_id: string;
  name: string;
  description?: string;
  fingerprint: string;
  script: string;
  source: RuleSource;
  status: RuleStatus;
  confidence?: number;
  success_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;
}

export interface DLQEvent {
  id: string;
  event_id: string;
  endpoint_id: string;
  tenant_id: string;
  payload: Record<string, unknown>;
  error_reason: string;
  attempts: number;
  notified: boolean;
  created_at: string;
}

// API response shapes
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface EventsListResponse {
  events: RawEvent[];
  total: number;
  limit: number;
  offset: number;
}

export interface WebhookReceiveResponse {
  eventId: string;
  status: EventStatus;
  message: string;
}

// Stats (derived client-side or from a future /stats endpoint)
export interface DashboardStats {
  eventsToday: number;
  healedToday: number;
  activeRules: number;
  dlqCount: number;
  healingSuccessRate: number;
}
