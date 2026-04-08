'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getOAuthCallbackUrl } from '@/lib/app-url';
import { isSupabasePublicEnvConfigured } from '@/lib/supabase/public-env';
import { useRouter } from 'next/navigation';
import SentinelBrand from '@/components/SentinelBrand';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function networkErrorMessage(err: unknown): string {
  if (err instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(String(err.message))) {
    return 'No se pudo conectar con Supabase. Revisá NEXT_PUBLIC_SUPABASE_URL en .env.local (URL del proyecto, sin placeholders), tu red y que el proyecto esté activo en supabase.com.';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Error inesperado. Intentá de nuevo.';
}

export default function AuthPage() {
  const router = useRouter();
  const configured = isSupabasePublicEnvConfigured();
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured]
  );

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'oauth') {
      const details = params.get('details');
      setError(
        details
          ? `Google: ${decodeURIComponent(details)}`
          : 'No se pudo completar el inicio de sesión con Google. Intentá de nuevo.'
      );
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('details');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, []);

  async function signInWithGoogle() {
    setError('');
    setInfo('');
    if (!supabase) {
      setError('Configurá Supabase en .env.local antes de continuar.');
      return;
    }
    setGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getOAuthCallbackUrl(),
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      setError(networkErrorMessage(err));
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!supabase) {
      setError('Configurá Supabase en .env.local antes de continuar.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: getOAuthCallbackUrl() },
        });
        if (error) setError(error.message);
        else setInfo('Revisá tu email para confirmar la cuenta.');
      }
    } catch (err) {
      setError(networkErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <SentinelBrand variant="auth" />

        {/* Card */}
        <div className="sentinel-card" style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
              {mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {mode === 'login' ? 'Accedé a tu panel de control' : 'Comenzá a monitorear tus pipelines'}
            </p>
          </div>

          {!configured && (
            <div style={{ padding: '10px 12px', borderRadius: '6px', marginBottom: '16px', background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.25)', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Falta configurar Supabase: en <span style={{ fontFamily: 'var(--font-mono)' }}>.env.local</span> copiá{' '}
              <strong style={{ color: 'var(--fg)' }}>Project URL</strong> y la clave <strong style={{ color: 'var(--fg)' }}>anon public</strong> desde el panel (Settings → API). Reiniciá{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>next dev</span> después de guardar.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              className="sentinel-input"
              onClick={signInWithGoogle}
              disabled={!configured || loading || googleLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: configured && !loading && !googleLoading ? 'pointer' : 'not-allowed',
                padding: '12px 14px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                opacity: googleLoading ? 0.7 : 1,
                background: 'rgba(255,255,255,.03)',
              }}
            >
              <GoogleIcon />
              {googleLoading ? 'Redirigiendo…' : 'Continuar con Google'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
              o con email
              <span style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '5px' }}>
                EMAIL
              </label>
              <input
                className="sentinel-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '5px' }}>
                CONTRASEÑA
              </label>
              <input
                className="sentinel-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: '11px', color: 'var(--red)' }}>
                {error}
              </div>
            )}
            {info && (
              <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(200,245,80,.08)', border: '1px solid rgba(200,245,80,.2)', fontSize: '11px', color: 'var(--accent)' }}>
                {info}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading || googleLoading || !configured}
              style={{ justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
            {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              {mode === 'login' ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          PRIMARY SENTINEL · AUTO-HEALING AI PIPELINE
        </div>
      </div>
    </div>
  );
}
