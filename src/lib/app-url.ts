/**
 * Base URL for OAuth and email confirmation redirects.
 * Set NEXT_PUBLIC_SITE_URL to the public site URL so redirect targets match your auth provider config.
 * If unset, the browser uses window.location.origin (fine for local dev).
 *
 * Supabase checklist (Auth → URL configuration):
 * - Enable “Confirm email” under Email provider if you want verified sign-ups.
 * - Site URL = public origin (e.g. https://yourdomain.com).
 * - Redirect URLs must include this app’s callback, e.g. https://yourdomain.com/auth/callback
 *   and http://localhost:3000/auth/callback (match port). Must match NEXT_PUBLIC_SITE_URL when set.
 */
export function getOAuthCallbackOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function getOAuthCallbackUrl(): string {
  const base = getOAuthCallbackOrigin();
  return base ? `${base}/auth/callback` : '/auth/callback';
}
