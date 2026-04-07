'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNotificationsContext } from '@/components/layout/NotificationsProvider';
import { notificationTypeConfig } from '@/lib/notifications';

export default function NotificationsPage() {
  const { notifications, loading, markAllRead, unread } = useNotificationsContext();

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
            <button className="btn-ghost" onClick={() => void markAllRead()} style={{ fontSize: '10px' }}>
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
            Las alertas aparecerán aquí cuando Primary Sentinel detecte eventos
          </div>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="sentinel-card" style={{ padding: 0, overflow: 'hidden' }}>
          {notifications.map((notif, i) => {
            const cfg = notificationTypeConfig[notif.type] ?? notificationTypeConfig.info;
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
                  width: '8px', height: '8px', borderRadius: '50%',
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

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <div className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
        TIEMPO REAL · Supabase Realtime
      </div>
    </div>
  );
}
