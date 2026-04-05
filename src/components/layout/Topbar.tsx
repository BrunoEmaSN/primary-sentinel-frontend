'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const titles: Record<string, string> = {
  '/dashboard': 'DASHBOARD',
  '/dashboard/flows': 'FLUJOS ACTIVOS',
  '/dashboard/rules': 'GESTOR DE REGLAS',
  '/dashboard/dlq': 'DEAD LETTER QUEUE',
  '/dashboard/notifications': 'NOTIFICACIONES',
  '/dashboard/settings': 'CONFIGURACIÓN',
};

export default function Topbar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'U';

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>
        {titles[pathname] ?? 'SENTINEL'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          {user.email}
        </div>
        <button
          onClick={signOut}
          className="btn-ghost"
          style={{ fontSize: '10px', padding: '4px 10px' }}
        >
          Salir
        </button>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'var(--border2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)',
        }}>
          {initials}
        </div>
      </div>
    </div>
  );
}
