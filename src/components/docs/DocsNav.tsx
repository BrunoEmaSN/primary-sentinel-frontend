'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import SentinelBrand from '@/components/SentinelBrand';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { allowPrices } from '@/lib/allowPrices';

function navLinkStyle(active: boolean) {
  return {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    padding: '7px 8px',
    borderRadius: '6px',
    cursor: 'pointer' as const,
    color: active ? 'var(--accent)' : 'var(--muted)',
    background: active ? 'rgba(200,245,80,.08)' : 'transparent',
    fontWeight: active ? 500 : 400,
    fontSize: '12px',
    transition: 'all .15s',
    textDecoration: 'none' as const,
  };
}

export default function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { dict } = useI18n();
  const n = dict.docs.nav;

  const NAV = useMemo(() => {
    const appItems = [
      { href: '/docs/dashboard', label: n.linkDashboard },
      { href: '/docs/flujos', label: n.linkFlujos },
      { href: '/docs/operaciones', label: n.linkOperaciones },
      { href: '/docs/reglas', label: n.linkReglas },
      { href: '/docs/dlq', label: n.linkDlq },
      { href: '/docs/notificaciones', label: n.linkNotif },
      { href: '/docs/configuracion', label: n.linkConfig },
      ...(allowPrices ? [{ href: '/docs/facturacion', label: n.linkBilling }] : []),
    ];
    return [
      {
        section: n.intro,
        items: [
          { href: '/docs', label: n.linkIntro },
          { href: '/docs/empezar', label: n.linkEmpezar },
        ],
      },
      {
        section: n.app,
        items: appItems,
      },
      {
        section: n.integration,
        items: [{ href: '/docs/api', label: n.linkApi }],
      },
    ];
  }, [n]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function isActive(href: string) {
    if (href === '/docs') return pathname === '/docs';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebarInner = (
    <>
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/docs" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setOpen(false)}>
          <SentinelBrand variant="sidebar" />
        </Link>
      </div>

      <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {NAV.map((group) => (
          <div key={group.section} style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '2px',
                color: 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                padding: '8px 8px 4px',
                textTransform: 'uppercase',
              }}
            >
              {group.section}
            </div>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setOpen(false)}>
                  <div style={navLinkStyle(active)}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'currentColor',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/" className="btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none', fontSize: '11px' }} onClick={() => setOpen(false)}>
          {n.back}
        </Link>
      </div>
    </>
  );

  return (
    <>
      <header className="docs-mobile-header md:hidden">
        <Link href="/docs" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
          {n.docsBadge}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? n.closeMenu : n.openMenu}
            onClick={() => setOpen((o) => !o)}
            className="btn-ghost"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            {open ? n.close : n.menu}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="docs-mobile-drawer-below-header md:hidden"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 55,
            background: 'rgba(0,0,0,.55)',
          }}
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className="docs-mobile-drawer-below-header md:hidden"
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: 'min(300px, 92vw)',
          zIndex: 56,
          background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-105%)',
          transition: 'transform 0.2s ease',
          boxShadow: open ? '8px 0 32px rgba(0,0,0,.4)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {sidebarInner}
      </aside>

      <nav
        className="hidden md:flex"
        style={{
          width: '240px',
          background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {sidebarInner}
      </nav>
    </>
  );
}
