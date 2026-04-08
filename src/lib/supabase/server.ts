import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabasePublicEnv, getSupabasePublicEnvOrThrow } from './public-env';

type ServerSupabaseClient = ReturnType<typeof createServerClient>;

async function buildServerClient(url: string, anonKey: string): Promise<ServerSupabaseClient> {
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookies can be read-only
        }
      },
    },
  });
}

/** Misma validación que `createClient()` en un solo paso; devuelve `null` si falta env (sin lanzar). */
export async function createClientIfConfigured(): Promise<ServerSupabaseClient | null> {
  const env = getSupabasePublicEnv();
  if (!env.ok) return null;
  return buildServerClient(env.url, env.anonKey);
}

export async function createClient() {
  const { url, anonKey } = getSupabasePublicEnvOrThrow();
  return buildServerClient(url, anonKey);
}
