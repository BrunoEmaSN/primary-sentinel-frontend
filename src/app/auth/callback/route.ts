import { NextResponse } from 'next/server';
import { createClientIfConfigured } from '@/lib/supabase/server';

function resolveSafeNextPath(nextParam: string | null, origin: string): string {
  const fallback = '/dashboard';
  if (!nextParam) return fallback;
  const trimmed = nextParam.trim();
  if (!trimmed) return fallback;
  try {
    const base = new URL(origin);
    const resolved = new URL(trimmed, base);
    if (resolved.origin !== base.origin) return fallback;
    if (resolved.pathname.includes('..')) return fallback;
    const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    return path.startsWith('/') ? path || fallback : fallback;
  } catch {
    return fallback;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');
  const next = resolveSafeNextPath(searchParams.get('next'), origin);

  if (oauthError) {
    const desc = searchParams.get('error_description') ?? oauthError;
    return NextResponse.redirect(
      `${origin}/auth?error=oauth&details=${encodeURIComponent(desc)}`
    );
  }

  if (code) {
    const supabase = await createClientIfConfigured();
    if (!supabase) {
      return NextResponse.redirect(
        `${origin}/auth?error=oauth&details=${encodeURIComponent(
          'Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (Settings / API, clave anon).'
        )}`
      );
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=oauth`);
}
