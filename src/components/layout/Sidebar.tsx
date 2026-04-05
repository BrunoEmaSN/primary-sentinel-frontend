'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',               section: 'Monitor' },
  { label: 'Flujos',        href: '/dashboard/flows',          section: 'Monitor' },
  { label: 'Reglas IA',     href: '/dashboard/rules',          section: 'Monitor', badge: 'pending' },
  { label: 'Dead Letter',   href: '/dashboard/dlq',            section: 'Incidentes', badge: 'dlq' },
  { label: 'Notificaciones',href: '/dashboard/notifications',  section: 'Incidentes' },
  { label: 'Configuración', href: '/dashboard/settings',       section: 'Config' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const sections = [...new Set(navItems.map(n => n.section))];

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
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="#0a0b0d" strokeWidth="1.5"/>
            <circle cx="8" cy="8" r="2" fill="#0a0b0d"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>SENTINEL</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '1.5px' }}>AI · SAAS</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {sections.map(section => (
          <div key={section} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', padding: '8px 8px 4px', textTransform: 'uppercase' }}>
              {section}
            </div>
            {navItems.filter(n => n.section === section).map(item => {
              const isActive = pathname === item.href;
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
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="pulse" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
        <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>SISTEMA OPERATIVO</div>
      </div>
    </nav>
  );
}
