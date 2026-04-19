/**
 * Sentinel SaaS — Destination types (aligned with worker Zod schemas)
 */

export interface SupabaseDestination {
  type: 'supabase';
  tableName: string;
  projectUrl?: string;
  /** Sent to API; worker normalizes to serviceKey */
  apiKey?: string;
  serviceKey?: string;
  connectionString?: string;
}

export interface PostgresDestination {
  type: 'postgres';
  connectionString: string;
  schema?: string;
  table: string;
  payloadColumn?: string;
}

export interface MysqlDestination {
  type: 'mysql';
  connectionString: string;
  database: string;
  table: string;
  payloadColumn?: string;
}

export interface WebhookDestination {
  type: 'webhook';
  url: string;
  headers?: Record<string, string>;
  method?: 'POST' | 'PUT' | 'PATCH';
  wrapKey?: string;
  retryOnFailure?: boolean;
  timeoutMs?: number;
}

export interface HttpApiDestination {
  type: 'http_api';
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  authType?: 'bearer' | 'basic' | 'api_key' | 'none';
  authValue?: string;
  authHeader?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface BigQueryDestination {
  type: 'bigquery';
  projectId: string;
  datasetId: string;
  tableId: string;
  serviceAccountKey?: string;
}

export type Destination =
  | SupabaseDestination
  | PostgresDestination
  | MysqlDestination
  | WebhookDestination
  | HttpApiDestination
  | BigQueryDestination;

export const DESTINATION_CONFIGS = {
  supabase: {
    icon: '🔷',
    fields: [
      { key: 'tableName', type: 'text' as const, required: true },
      { key: 'projectUrl', type: 'text' as const, required: false },
      { key: 'connectionString', type: 'text' as const, required: false },
      { key: 'apiKey', type: 'password' as const, required: false },
    ],
  },
  postgres: {
    icon: '🐘',
    fields: [
      { key: 'connectionString', type: 'password' as const, required: true },
      { key: 'schema', type: 'text' as const, required: false },
      { key: 'table', type: 'text' as const, required: true },
      { key: 'payloadColumn', type: 'text' as const, required: false },
    ],
  },
  mysql: {
    icon: '🐬',
    fields: [
      { key: 'connectionString', type: 'password' as const, required: true },
      { key: 'database', type: 'text' as const, required: true },
      { key: 'table', type: 'text' as const, required: true },
      { key: 'payloadColumn', type: 'text' as const, required: false },
    ],
  },
  webhook: {
    icon: '🔗',
    fields: [
      { key: 'url', type: 'url' as const, required: true },
      { key: 'method', type: 'select' as const, options: ['POST', 'PUT', 'PATCH'] as const, required: false },
      { key: 'headers', type: 'textarea' as const, required: false },
      { key: 'wrapKey', type: 'text' as const, required: false },
      { key: 'timeoutMs', type: 'number' as const, required: false },
      { key: 'retryOnFailure', type: 'checkbox' as const, required: false },
    ],
  },
  http_api: {
    icon: '🌐',
    fields: [
      { key: 'url', type: 'url' as const, required: true },
      { key: 'method', type: 'select' as const, options: ['POST', 'PUT', 'PATCH'] as const, required: false },
      { key: 'authType', type: 'select' as const, options: ['none', 'bearer', 'basic', 'api_key'] as const, required: false },
      { key: 'authValue', type: 'password' as const, required: false },
      { key: 'authHeader', type: 'text' as const, required: false },
      { key: 'headers', type: 'textarea' as const, required: false },
      { key: 'timeoutMs', type: 'number' as const, required: false },
    ],
  },
  bigquery: {
    icon: '📊',
    fields: [
      { key: 'projectId', type: 'text' as const, required: true },
      { key: 'datasetId', type: 'text' as const, required: true },
      { key: 'tableId', type: 'text' as const, required: true },
      { key: 'serviceAccountKey', type: 'password' as const, required: true },
    ],
  },
} as const;

export type DestinationType = keyof typeof DESTINATION_CONFIGS;

type FieldConfig = (typeof DESTINATION_CONFIGS)[DestinationType]['fields'][number];

/** Valores iniciales por tipo para que cada slot envíe todas las claves definidas en la UI. */
export function createEmptyDestination(t: DestinationType): Destination {
  const fields = DESTINATION_CONFIGS[t].fields as readonly FieldConfig[];
  const o: Record<string, unknown> = { type: t };
  for (const f of fields) {
    switch (f.type) {
      case 'checkbox':
        o[f.key] = f.key === 'retryOnFailure';
        break;
      case 'number':
        o[f.key] = undefined;
        break;
      case 'select': {
        const opts = 'options' in f && f.options.length > 0 ? f.options : [];
        o[f.key] = opts.length > 0 ? opts[0]! : '';
        break;
      }
      default:
        o[f.key] = '';
    }
  }
  return o as unknown as Destination;
}
