import { createBrowserClient } from '@supabase/ssr';
import { getSupabasePublicEnvOrThrow } from './public-env';

export function createClient() {
  const { url, anonKey } = getSupabasePublicEnvOrThrow();
  return createBrowserClient(url, anonKey);
}
