'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import TopbarNotifications from '@/components/layout/TopbarNotifications';
import { useI18n } from '@/lib/i18n/I18nProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type Menu = 'none' | 'profile' | 'notifications';

export default function Topbar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  const pageTitle = (() => {
    const key = `topbar.titles.${pathname}`;
    const resolved = t(key);
    if (resolved !== key) return resolved;
    return t('topbar.defaultTitle');
  })();
  const [menu, setMenu] = useState<Menu>('none');
  const profileWrapRef = useRef<HTMLDivElement>(null);

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'U';

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  useEffect(() => {
    if (menu !== 'profile') return;
    function handlePointerDown(e: MouseEvent) {
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target as Node)) {
        setMenu('none');
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [menu]);

  return (
    <div style={{
      height: '52px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
      background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>
          {pageTitle}
        </div>
        <Link
          href="/docs"
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--muted)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          {t('common.docs')}
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LanguageSwitcher variant="compact" />
        <TopbarNotifications
          open={menu === 'notifications'}
          onOpenChange={(open) => setMenu(open ? 'notifications' : 'none')}
        />

        <div ref={profileWrapRef} style={{ position: 'relative' }}>
          <button
            type="button"
            aria-expanded={menu === 'profile'}
            aria-haspopup="true"
            onClick={() => setMenu((m) => (m === 'profile' ? 'none' : 'profile'))}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--border2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              padding: 0,
            }}
            title={t('topbar.accountMenu')}
          >
            {initials}
          </button>

          {menu === 'profile' && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: '200px',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                boxShadow: '0 12px 40px rgba(0,0,0,.45)',
                zIndex: 100,
                padding: '6px 0',
              }}
            >
              <div
                style={{
                  padding: '8px 14px 10px',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-mono)',
                  wordBreak: 'break-all',
                }}
              >
                {user.email}
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setMenu('none')}
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                {t('topbar.settings')}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenu('none');
                  void signOut();
                }}
                className="btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  borderRadius: 0,
                  fontSize: '12px',
                  padding: '10px 14px',
                  borderTop: '1px solid var(--border)',
                  marginTop: '4px',
                }}
              >
                {t('topbar.signOut')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
