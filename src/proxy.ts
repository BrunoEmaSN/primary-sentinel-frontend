import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createSentinelCspHeaderValue } from '@/lib/contentSecurityPolicy';

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (const b of bytes) {
    bin += String.fromCharCode(b);
  }
  return btoa(bin);
}

/**
 * CSP con nonces (Next.js aplica el nonce a scripts del framework cuando la petición
 * incluye `Content-Security-Policy` con `nonce-…`).
 *
 * - Producción: `Content-Security-Policy` (enforcing), salvo `CSP_REPORT_ONLY=true`.
 * - Desarrollo: `Content-Security-Policy-Report-Only` para detectar violaciones sin bloquear.
 */
export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  const policy = createSentinelCspHeaderValue({ nonce, isDev });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', policy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const reportOnly = isDev || process.env.CSP_REPORT_ONLY === 'true';
  response.headers.set(
    reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
    policy,
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
