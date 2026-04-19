'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNotificationsContext } from '@/components/layout/NotificationsProvider';
import { notificationTypeConfig } from '@/lib/notifications';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TopbarNotifications({ open, onOpenChange }: Props) {
  const { notifications, loading, markAllRead, markingAllRead, unread } = useNotificationsContext();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open, onOpenChange]);

  const preview = notifications.slice(0, 8);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onOpenChange(!open)}
        className="btn-ghost"
        style={{
          padding: '6px',
          position: 'relative',
          borderRadius: '8px',
        }}
        title="Notificaciones"
      >
        <BellIcon />
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              borderRadius: '999px',
              background: 'var(--red)',
              color: '#fff',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 'min(360px, calc(100vw - 40px))',
            maxHeight: 'min(380px, 70vh)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            boxShadow: '0 12px 40px rgba(0,0,0,.45)',
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
              Notificaciones
            </span>
            {unread > 0 && (
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '10px', padding: '4px 8px', opacity: markingAllRead ? 0.65 : 1 }}
                disabled={markingAllRead}
                onClick={() => void markAllRead()}
              >
                {markingAllRead ? 'Marcando…' : 'Marcar leídas'}
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
                Cargando…
              </div>
            )}
            {!loading && preview.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
                Sin notificaciones
              </div>
            )}
            {!loading &&
              preview.map((notif, i) => {
                const cfg = notificationTypeConfig[notif.type] ?? notificationTypeConfig.info;
                return (
                  <div
                    key={notif.id}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      padding: '10px 12px',
                      borderBottom: i < preview.length - 1 ? '1px solid var(--border)' : 'none',
                      background: notif.read ? 'transparent' : 'rgba(200,245,80,.04)',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: cfg.color,
                        flexShrink: 0,
                        marginTop: '5px',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text)',
                          fontWeight: notif.read ? 400 : 600,
                          lineHeight: 1.35,
                        }}
                      >
                        {cfg.icon} {notif.title}
                      </div>
                      {notif.body && (
                        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.3 }}>
                          {notif.body}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: '9px',
                          color: 'var(--muted)',
                          fontFamily: 'var(--font-mono)',
                          marginTop: '4px',
                        }}
                      >
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <Link
              href="/dashboard/notifications"
              onClick={() => onOpenChange(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              Ver todas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
