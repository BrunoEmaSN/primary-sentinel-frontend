/**
 * Chat (Arsi) y Sales (Lema) llaman a Workers distintos del dashboard.
 * En producción, si la env es una URL absoluta (p. ej. https://api…/gateway),
 * las peticiones van por mismo origen `/worker-api-chat` o `/worker-api-sales` (rewrites en next.config.mjs)
 * para alinear rutas con el gateway y evitar CORS.
 */

export type SentinelWorkerKind = 'chat' | 'sales';

const PROXY_PATH: Record<SentinelWorkerKind, string> = {
  chat: '/worker-api-chat',
  sales: '/worker-api-sales',
};

function isLoopbackHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return h === 'localhost' || h === '127.0.0.1' || h === '::1';
}

/**
 * Base que reciben los componentes (layout): ruta relativa de proxy o URL absoluta en dev local.
 */
export function resolveSentinelWorkerBrowserBase(urlFromEnv: string, kind: SentinelWorkerKind): string {
  const w = urlFromEnv.trim();
  if (!w) return '';
  if (w.startsWith('/')) {
    return w.replace(/\/$/, '') || w;
  }
  try {
    const u = new URL(w);
    if (isLoopbackHostname(u.hostname)) {
      return w.replace(/\/$/, '');
    }
  } catch {
    return w.replace(/\/$/, '');
  }
  return PROXY_PATH[kind];
}

/** Base absoluta para `fetch` en el cliente. */
export function absoluteSentinelWorkerFetchBase(browserBase: string): string {
  const b = browserBase.trim();
  if (!b) return '';
  if (b.startsWith('http://') || b.startsWith('https://')) {
    return b.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const path = b.startsWith('/') ? b : `/${b}`;
    return `${window.location.origin}${path}`.replace(/\/$/, '');
  }
  return b;
}
