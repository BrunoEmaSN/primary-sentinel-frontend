'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getOAuthCallbackUrl } from '@/lib/app-url';
import { getSupabasePublicEnv } from '@/lib/supabase/public-env';
import { useRouter } from 'next/navigation';
import SentinelBrand from '@/components/SentinelBrand';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/I18nProvider';

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

export default function AuthPage() {
  const router = useRouter();
  const { t } = useI18n();
  const supabaseEnv = getSupabasePublicEnv();

  function networkErrorMessage(err: unknown): string {
    if (err instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(String(err.message))) {
      return t('auth.errorNetwork');
    }
    if (err instanceof Error) {
      return err.message;
    }
    return t('auth.errorUnexpected');
  }
  const configured = supabaseEnv.ok;
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
      setError(details ? `Google: ${decodeURIComponent(details)}` : t('auth.oauthFailed'));
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('details');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [t]);

  async function signInWithGoogle() {
    setError('');
    setInfo('');
    if (!supabase) {
      setError(t('auth.configureSupabase'));
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
      setError(t('auth.configureSupabase'));
      return;
    }
    setLoading(true);
    try {
      const emailNorm = email.trim().toLowerCase();
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailNorm,
          password,
        });
        if (error) setError(error.message);
        else router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email: emailNorm,
          password,
          options: { emailRedirectTo: getOAuthCallbackUrl() },
        });
        if (error) setError(error.message);
        else setInfo(t('auth.confirmEmail'));
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
      position: 'relative',
    }}>
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 10,
        }}
      >
        <LanguageSwitcher variant="compact" />
      </div>
      {/* Background grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: '400px' }}>
        <SentinelBrand variant="auth" />

        <div className="sentinel-card" style={{ padding: '28px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '38px 1fr 38px',
              alignItems: 'start',
              marginBottom: '20px',
            }}
          >
            <span aria-hidden style={{ width: 38, height: 38 }} />
            <div style={{ textAlign: 'center', minWidth: 0, paddingTop: '2px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginBottom: '4px',
                  textAlign: 'center',
                }}
              >
                {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.45, textAlign: 'center' }}>
                {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
              </p>
            </div>
            <Link
              href="/"
              className="auth-close-round"
              aria-label={t('auth.closeAria')}
              title={t('auth.closeTitle')}
              style={{ justifySelf: 'end' }}
            >
              <CloseIcon />
            </Link>
          </div>

          {!configured && (
            <div style={{ padding: '10px 12px', borderRadius: '6px', marginBottom: '16px', background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.25)', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
              {!supabaseEnv.ok && supabaseEnv.reason === 'service_role'
                ? t('auth.errorServiceRole')
                : t('auth.errorMissingEnv')}
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
              {googleLoading ? t('auth.googleRedirect') : t('auth.googleContinue')}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
              {t('auth.orEmail')}
              <span style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '5px' }}>
                {t('auth.emailLabel')}
              </label>
              <input
                className="sentinel-input"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '5px' }}>
                {t('auth.passwordLabel')}
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
              {loading ? t('auth.loading') : mode === 'login' ? t('auth.submitLogin') : t('auth.submitSignup')}
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
            {mode === 'login' ? t('auth.toggleSignup') : t('auth.toggleLogin')}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
            >
              {mode === 'login' ? t('auth.register') : t('auth.loginLink')}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          {t('auth.footerTag')}
        </div>
      </div>
    </div>
  );
}
