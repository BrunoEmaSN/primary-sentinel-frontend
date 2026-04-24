'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSupabasePublicEnv } from '@/lib/supabase/public-env';
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const supabaseEnv = getSupabasePublicEnv();
  const configured = supabaseEnv.ok;
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured]
  );

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true);
      setHasSession(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setHasSession(!!session);
      setSessionReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  function networkErrorMessage(err: unknown): string {
    if (err instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(String(err.message))) {
      return t('auth.errorNetwork');
    }
    if (err instanceof Error) {
      return err.message;
    }
    return t('auth.errorUnexpected');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!supabase) {
      setError(t('auth.configureSupabase'));
      return;
    }
    const p = password.trim();
    if (!p) {
      setError(t('auth.errorPasswordRequired'));
      return;
    }
    if (p.length < 6) {
      setError(t('auth.resetPasswordErrorWeak'));
      return;
    }
    if (p !== confirm) {
      setError(t('auth.resetPasswordMismatch'));
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: p });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setInfo(t('auth.resetPasswordSuccess'));
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err) {
      setError(networkErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const showForm = sessionReady && hasSession;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >
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
      <div
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            'linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

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
                {t('auth.resetPasswordTitle')}
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.45, textAlign: 'center' }}>
                {t('auth.resetPasswordSubtitle')}
              </p>
            </div>
            <Link
              href="/auth"
              className="auth-close-round"
              aria-label={t('auth.closeAria')}
              title={t('auth.closeTitle')}
              style={{ justifySelf: 'end' }}
            >
              <CloseIcon />
            </Link>
          </div>

          {!configured && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                background: 'rgba(251,191,36,.08)',
                border: '1px solid rgba(251,191,36,.25)',
                fontSize: '11px',
                color: 'var(--muted)',
                lineHeight: 1.5,
              }}
            >
              {!supabaseEnv.ok && supabaseEnv.reason === 'service_role'
                ? t('auth.errorServiceRole')
                : t('auth.errorMissingEnv')}
            </div>
          )}

          {!sessionReady && (
            <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center' }}>{t('auth.loading')}</p>
          )}

          {sessionReady && !hasSession && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
              <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
                {t('auth.resetPasswordNoSession')}
              </p>
              <Link
                href="/auth"
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                {t('auth.requestNewResetLink')}
              </Link>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '1px',
                    color: 'var(--muted)',
                    marginBottom: '5px',
                  }}
                >
                  {t('auth.newPasswordLabel')}
                </label>
                <input
                  className="sentinel-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '1px',
                    color: 'var(--muted)',
                    marginBottom: '5px',
                  }}
                >
                  {t('auth.confirmPasswordLabel')}
                </label>
                <input
                  className="sentinel-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(239,68,68,.08)',
                    border: '1px solid rgba(239,68,68,.2)',
                    fontSize: '11px',
                    color: 'var(--red)',
                  }}
                >
                  {error}
                </div>
              )}
              {info && (
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(200,245,80,.08)',
                    border: '1px solid rgba(200,245,80,.2)',
                    fontSize: '11px',
                    color: 'var(--accent)',
                  }}
                >
                  {info}
                </div>
              )}

              <button
                className="btn-primary"
                type="submit"
                disabled={loading || !configured}
                style={{ justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? t('auth.loading') : t('auth.resetPasswordSubmit')}
              </button>
            </form>
          )}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '10px',
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {t('auth.footerTag')}
        </div>
      </div>
    </div>
  );
}
