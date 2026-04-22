/**
 * CSP por petición (nonces + strict-dynamic en script-src).
 * `style-src` mantiene `unsafe-inline` por compatibilidad con librerías UI (p. ej. sonner);
 * refinar aparte si se adoptan nonces en estilos.
 */

export type SentinelCspOptions = {
  nonce: string;
  isDev: boolean;
};

export function createSentinelCspHeaderValue(opts: SentinelCspOptions): string {
  const { nonce, isDev } = opts;

  const scriptSrcParts = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    'https://vercel.live',
    'https://va.vercel-scripts.com',
  ];
  if (isDev) {
    scriptSrcParts.push("'unsafe-eval'");
  }

  return [
    "default-src 'self'",
    scriptSrcParts.join(' '),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    [
      "connect-src 'self'",
      'https://*.supabase.co',
      'wss://*.supabase.co',
      'https://vercel.live',
      'https://va.vercel-scripts.com',
      'https://vitals.vercel-insights.com',
      'http://127.0.0.1:8787',
      'http://localhost:8787',
      'ws://127.0.0.1:8787',
      'ws://localhost:8787',
    ].join(' '),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}
