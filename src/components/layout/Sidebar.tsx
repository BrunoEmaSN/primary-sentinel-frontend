'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SentinelBrand from '@/components/SentinelBrand';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { SIDEBAR_HREF_TO_ITEM_KEY } from '@/lib/i18n/sidebarNav';

const navItems = [
  { href: '/dashboard', section: 'monitor' as const },
  { href: '/dashboard/flows', section: 'monitor' },
  { href: '/dashboard/operations', section: 'monitor' },
  { href: '/dashboard/rules', section: 'monitor', badge: 'pending' as const },
  { href: '/dashboard/dlq', section: 'incidents', badge: 'dlq' as const },
  { href: '/dashboard/settings', section: 'config' },
  { href: '/docs', section: 'help' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const sections = [...new Set(navItems.map((n) => n.section))];

  return (
    <nav style={{
      width: '220px',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
    }}>
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)' }}>
        <SentinelBrand variant="sidebar" />
      </div>

      <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {sections.map((section) => (
          <div key={section} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', padding: '8px 8px 4px', textTransform: 'uppercase' }}>
              {t(`sidebar.sections.${section}`)}
            </div>
            {navItems.filter((n) => n.section === section).map((item) => {
              const isActive = pathname === item.href;
              const itemKey = SIDEBAR_HREF_TO_ITEM_KEY[item.href];
              const label = itemKey ? t(`sidebar.items.${itemKey}`) : item.href;
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 8px', borderRadius: '6px', cursor: 'pointer',
                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                    background: isActive ? 'rgba(200,245,80,.08)' : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: '12px',
                    transition: 'all .15s',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
        <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{t('sidebar.status')}</div>
      </div>
    </nav>
  );
}
