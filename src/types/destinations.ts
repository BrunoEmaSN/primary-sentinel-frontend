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
    label: 'Supabase (tabla / proyecto externo)',
    description: 'Insert en tabla via Supabase JS (URL https del proyecto + opcional service role)',
    icon: '🔷',
    fields: [
      { key: 'tableName', label: 'Nombre de tabla', type: 'text' as const, required: true },
      { key: 'projectUrl', label: 'URL del proyecto (opcional)', type: 'text' as const, required: false },
      { key: 'connectionString', label: 'URL proyecto como connectionString https (opcional)', type: 'text' as const, required: false },
      { key: 'apiKey', label: 'Service role key (se cifra en servidor)', type: 'password' as const, required: false },
    ],
  },
  postgres: {
    label: 'PostgreSQL',
    description: 'INSERT JSON en columna (TCP desde Worker; tabla debe tener columna JSON/JSONB)',
    icon: '🐘',
    fields: [
      { key: 'connectionString', label: 'Connection string (cifrado)', type: 'password' as const, required: true },
      { key: 'schema', label: 'Schema (default public)', type: 'text' as const, required: false },
      { key: 'table', label: 'Tabla destino', type: 'text' as const, required: true },
      { key: 'payloadColumn', label: 'Columna JSON (default payload)', type: 'text' as const, required: false },
    ],
  },
  mysql: {
    label: 'MySQL',
    description: 'INSERT JSON en columna tipo JSON',
    icon: '🐬',
    fields: [
      { key: 'connectionString', label: 'Connection string (cifrado)', type: 'password' as const, required: true },
      { key: 'database', label: 'Base de datos', type: 'text' as const, required: true },
      { key: 'table', label: 'Tabla destino', type: 'text' as const, required: true },
      { key: 'payloadColumn', label: 'Columna JSON (default payload)', type: 'text' as const, required: false },
    ],
  },
  webhook: {
    label: 'Webhook (HTTP relay)',
    description: 'fetch() al destino con JSON validado',
    icon: '🔗',
    fields: [
      { key: 'url', label: 'URL destino', type: 'url' as const, required: true },
      { key: 'method', label: 'Método HTTP', type: 'select' as const, options: ['POST', 'PUT', 'PATCH'], required: false },
      { key: 'headers', label: 'Headers (JSON objeto)', type: 'textarea' as const, required: false },
      { key: 'wrapKey', label: 'Envolver payload en clave (opcional)', type: 'text' as const, required: false },
      { key: 'timeoutMs', label: 'Timeout (ms)', type: 'number' as const, required: false },
      { key: 'retryOnFailure', label: 'Reintentar 1 vez si falla', type: 'checkbox' as const, required: false },
    ],
  },
  http_api: {
    label: 'HTTP API (auth)',
    description: 'POST/PUT/PATCH con Bearer, Basic o API key',
    icon: '🌐',
    fields: [
      { key: 'url', label: 'URL', type: 'url' as const, required: true },
      { key: 'method', label: 'Método', type: 'select' as const, options: ['POST', 'PUT', 'PATCH'], required: false },
      { key: 'authType', label: 'Auth', type: 'select' as const, options: ['none', 'bearer', 'basic', 'api_key'], required: false },
      { key: 'authValue', label: 'Token / user:pass / key (cifrado si aplica)', type: 'password' as const, required: false },
      { key: 'authHeader', label: 'Nombre header API key (default X-Api-Key)', type: 'text' as const, required: false },
      { key: 'headers', label: 'Headers extra (JSON)', type: 'textarea' as const, required: false },
      { key: 'timeoutMs', label: 'Timeout (ms)', type: 'number' as const, required: false },
    ],
  },
  bigquery: {
    label: 'BigQuery',
    description: 'Streaming insert via API REST',
    icon: '📊',
    fields: [
      { key: 'projectId', label: 'Google Cloud Project ID', type: 'text' as const, required: true },
      { key: 'datasetId', label: 'Dataset ID', type: 'text' as const, required: true },
      { key: 'tableId', label: 'Table ID', type: 'text' as const, required: true },
      { key: 'serviceAccountKey', label: 'Service Account JSON (cifrado)', type: 'password' as const, required: false },
    ],
  },
} as const;

export type DestinationType = keyof typeof DESTINATION_CONFIGS;
