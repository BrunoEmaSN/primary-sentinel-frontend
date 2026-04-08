/**
 * Base URL for OAuth and email confirmation redirects.
 * On Vercel, set NEXT_PUBLIC_SITE_URL to your deployment URL (e.g. https://tu-app.vercel.app)
 * so Supabase redirectTo matches an entry in Authentication → URL Configuration → Redirect URLs.
 * If unset, the browser uses window.location.origin (fine for local dev).
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
