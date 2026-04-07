'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabasePublicEnvConfigured } from '@/lib/supabase/public-env';
import { useRouter } from 'next/navigation';
import SentinelBrand from '@/components/SentinelBrand';

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
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

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
        const { error } = await supabase.auth.signUp({ email, password });
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
              disabled={loading || !configured}
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
          SENTINEL SAAS · AUTO-HEALING AI PIPELINE
        </div>
      </div>
    </div>
  );
}
