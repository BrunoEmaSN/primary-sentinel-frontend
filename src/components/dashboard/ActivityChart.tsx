'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { RawEvent } from '@/types';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function ActivityChart({ events }: { events: RawEvent[] }) {
  const { dict } = useI18n();
  const ac = dict.dashboard.activityChart;

  const data = useMemo(() => {
    const hours: Record<number, { loaded: number; healed: number; dead: number }> = {};
    for (let i = 23; i >= 0; i--) {
      const h = (new Date().getHours() - i + 24) % 24;
      hours[h] = { loaded: 0, healed: 0, dead: 0 };
    }
    events.forEach(e => {
      const h = new Date(e.created_at).getHours();
      if (hours[h]) {
        if (e.status === 'healed') hours[h].healed++;
        else if (e.status === 'dead') hours[h].dead++;
        else hours[h].loaded++;
      }
    });
    return Object.entries(hours).map(([hour, counts]) => ({
      hour: `${hour}h`,
      ...counts,
      total: counts.loaded + counts.healed + counts.dead,
    }));
  }, [events]);

  return (
    <div className="sentinel-card">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
        {ac.title}
      </div>
      <div style={{ height: '80px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              tick={{ fill: 'var(--muted)', fontSize: 8, fontFamily: 'Space Mono' }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: '6px', fontSize: '10px', fontFamily: 'Space Mono' }}
              labelStyle={{ color: 'var(--accent)' }}
              itemStyle={{ color: 'var(--text)' }}
            />
            <Bar dataKey="loaded" stackId="a" fill="#3b82f6" radius={[0,0,0,0]}/>
            <Bar dataKey="healed" stackId="a" fill="#c8f550" radius={[0,0,0,0]}/>
            <Bar dataKey="dead"   stackId="a" fill="#ef4444" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        {[
          { color: 'var(--blue)',   label: ac.legendLoaded },
          { color: 'var(--accent)', label: ac.legendHealed },
          { color: 'var(--red)',    label: ac.legendDead },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: 'var(--muted)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
