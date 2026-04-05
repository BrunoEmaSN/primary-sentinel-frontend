'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'healed' | 'dead' | 'rule_created' | 'rule_pending' | 'info';
  title: string;
  body?: string;
  created_at: string;
  read: boolean;
}

const typeConfig = {
  healed:       { icon: '✦', color: 'var(--accent)' },
  dead:         { icon: '⚠', color: 'var(--red)' },
  rule_created: { icon: '★', color: 'var(--teal)' },
  rule_pending: { icon: '◎', color: 'var(--amber)' },
  info:         { icon: '●', color: 'var(--blue)' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function load() {
    // Fetch from Supabase notifications table
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();

    // Realtime subscription
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function markAllRead() {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>NOTIFICACIONES</div>
            {unread > 0 && (
              <div style={{ fontSize: '10px', color: 'var(--amber)', marginTop: '2px' }}>
                {unread} sin leer
              </div>
            )}
          </div>
          {unread > 0 && (
            <button className="btn-ghost" onClick={markAllRead} style={{ fontSize: '10px' }}>
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '11px' }}>
          Cargando notificaciones…
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="sentinel-card" style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Sin notificaciones aún</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
            Las alertas aparecerán aquí cuando el Sentinel detecte eventos
          </div>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="sentinel-card" style={{ padding: 0, overflow: 'hidden' }}>
          {notifications.map((notif, i) => {
            const cfg = typeConfig[notif.type] ?? typeConfig.info;
            return (
              <div
                key={notif.id}
                style={{
                  display: 'flex', gap: '10px', padding: '12px 16px',
                  borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                  background: notif.read ? 'transparent' : 'rgba(200,245,80,.02)',
                }}
              >
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50',
                  background: cfg.color, flexShrink: 0, marginTop: '4px',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: notif.read ? 400 : 500, lineHeight: 1.4 }}>
                    {cfg.icon} {notif.title}
                  </div>
                  {notif.body && (
                    <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{notif.body}</div>
                  )}
                  <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                    {!notif.read && <span style={{ color: 'var(--accent)', marginLeft: '8px' }}>● NUEVA</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Realtime indicator */}
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <div className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
        TIEMPO REAL · Supabase Realtime
      </div>
    </div>
  );
}
