import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClientIfConfigured } from '@/lib/supabase/server';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Primary Sentinel — Inteligencia autónoma de fiabilidad y seguridad',
  description:
    'Inteligencia autónoma de fiabilidad y seguridad para tus pipelines de datos: monitoreá, protegé y gestioná con IA en un solo panel.',
};

function firstParam(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

type RootSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RootPage({ searchParams }: { searchParams: RootSearchParams }) {
  const sp = await searchParams;
  const code = firstParam(sp.code);
  const oauthError = firstParam(sp.error);
  if (code || oauthError) {
    const qs = new URLSearchParams();
    if (code) qs.set('code', code);
    if (oauthError) {
      qs.set('error', oauthError);
      const desc = firstParam(sp.error_description);
      if (desc) qs.set('error_description', desc);
    }
    const next = firstParam(sp.next);
    if (next) qs.set('next', next);
    redirect(`/auth/callback?${qs.toString()}`);
  }

  const supabase = await createClientIfConfigured();
  if (!supabase) {
    return <LandingPage />;
  }
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
