/** Patterns that indicate the user has not replaced template values from .env.example */
const PLACEHOLDER_PATTERNS = [
  /xxxx/i,
  /YOUR_PROJECT_REF/i,
  /PASTE_ANON_KEY_HERE/i,
  /\byour[_-]?project\b/i,
  /placeholder/i,
  /REPLACE_ME/i,
];

/** Reject service_role JWTs — they must never ship to the browser (NEXT_PUBLIC_*). */
function jwtRole(claims: string): string | undefined {
  try {
    const part = claims.split('.')[1];
    if (!part) return undefined;
    const json = JSON.parse(
      atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    ) as { role?: string };
    return typeof json.role === 'string' ? json.role : undefined;
  } catch {
    return undefined;
  }
}

export type SupabasePublicEnvResult =
  | { ok: true; url: string; anonKey: string }
  | { ok: false };

function validatePublicSupabaseEnv(): SupabasePublicEnvResult {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    return { ok: false };
  }
  if (jwtRole(anonKey) === 'service_role') {
    return { ok: false };
  }
  if (PLACEHOLDER_PATTERNS.some((p) => p.test(url) || p.test(anonKey))) {
    return { ok: false };
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { ok: false };
    }
  } catch {
    return { ok: false };
  }
  return { ok: true, url, anonKey };
}

/** Una sola lectura de env + reglas; usala cuando necesites url/anonKey sin desincronizar con `createClient`. */
export function getSupabasePublicEnv(): SupabasePublicEnvResult {
  return validatePublicSupabaseEnv();
}

export function isSupabasePublicEnvConfigured(): boolean {
  return validatePublicSupabaseEnv().ok;
}

export function getSupabasePublicEnvOrThrow(): { url: string; anonKey: string } {
  const result = validatePublicSupabaseEnv();
  if (!result.ok) {
    const role = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? jwtRole(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim())
      : undefined;
    if (role === 'service_role') {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY no puede ser la clave service_role. En Supabase → Settings → API usá la clave anon (public) en el cliente. Rotá la service_role si la expusiste.'
      );
    }
    throw new Error(
      'Supabase no está configurado: en .env.local definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY con los valores del panel de Supabase (Settings → API), sin placeholders.'
    );
  }
  return { url: result.url, anonKey: result.anonKey };
}
