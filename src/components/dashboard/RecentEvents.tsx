'use client';

import type { RawEvent } from '@/types';
import { formatDistanceToNow, isValid } from 'date-fns';
import { es as esLocale } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function RecentEvents({ events, loading }: { events: RawEvent[]; loading: boolean }) {
  const { locale, dict } = useI18n();
  const dfLocale = locale === 'en' ? enUS : esLocale;
  const ev = dict.dashboard.eventStatus;
  const re = dict.dashboard.recentEvents;

  const statusConfig = {
    loaded:     { icon: '●', color: 'var(--blue)',   bg: 'rgba(59,130,246,.12)',  label: ev.loaded },
    healed:     { icon: '✦', color: 'var(--accent)', bg: 'rgba(200,245,80,.12)', label: ev.healed },
    dead:       { icon: '⚠', color: 'var(--red)',    bg: 'rgba(239,68,68,.12)',  label: ev.dead },
    processing: { icon: '◎', color: 'var(--amber)',  bg: 'rgba(245,158,11,.12)', label: ev.processing },
  };

  return (
    <div className="sentinel-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{re.title}</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{re.subtitle}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
        {loading && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: '44px', background: 'var(--bg2)', borderRadius: '6px', opacity: 0.5 }} />
          ))
        )}
        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: '11px' }}>
            {re.empty}
          </div>
        )}
        {!loading && events.map(event => {
          const cfg = statusConfig[event.status] ?? statusConfig.processing;
          const at = new Date(event.created_at);
          const timeLabel = isValid(at)
            ? formatDistanceToNow(at, { addSuffix: true, locale: dfLocale })
            : '—';
          return (
            <div
              key={event.id}
              className="slide-in"
              style={{
                display: 'flex', gap: '8px', alignItems: 'flex-start',
                padding: '8px', background: 'var(--bg2)',
                borderRadius: '6px', border: '1px solid var(--border)',
              }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '5px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: cfg.bg, color: cfg.color, fontSize: '10px', flexShrink: 0,
              }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cfg.label} · {event.id.slice(0, 8)}…
                </div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {timeLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
