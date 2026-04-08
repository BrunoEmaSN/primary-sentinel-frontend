/** Patterns that indicate the user has not replaced template values from .env.example */
const PLACEHOLDER_PATTERNS = [
  /xxxx/i,
  /YOUR_PROJECT_REF/i,
  /PASTE_ANON_KEY_HERE/i,
  /\byour[_-]?project\b/i,
  /placeholder/i,
  /REPLACE_ME/i,
];

function validatePublicSupabaseEnv():
  | { ok: true; url: string; anonKey: string }
  | { ok: false } {
  const url = process.env.SUPABASE_URL?.trim();
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
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

export function isSupabasePublicEnvConfigured(): boolean {
  return validatePublicSupabaseEnv().ok;
}

export function getSupabasePublicEnvOrThrow(): { url: string; anonKey: string } {
  const result = validatePublicSupabaseEnv();
  if (!result.ok) {
    throw new Error(
      'Supabase no está configurado: en .env.local definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY con los valores del panel de Supabase (Settings → API), sin placeholders.'
    );
  }
  return { url: result.url, anonKey: result.anonKey };
}
