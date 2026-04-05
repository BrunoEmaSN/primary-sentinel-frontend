'use client';

import { useCallback, useEffect, useState } from 'react';
import { listEndpoints, listAllEvents, listAllRules, listDLQ } from '@/lib/api';
import type { RawEvent, TransformationRule, Endpoint } from '@/types';
import StatsCards from '@/components/dashboard/StatsCards';
import FlowDiagram from '@/components/dashboard/FlowDiagram';
import RecentEvents from '@/components/dashboard/RecentEvents';
import ActivityChart from '@/components/dashboard/ActivityChart';
import AgentStatus from '@/components/dashboard/AgentStatus';

export default function DashboardPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [rules, setRules] = useState<TransformationRule[]>([]);
  const [dlqCount, setDlqCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [eps, evts, rls, dlq] = await Promise.all([
      listEndpoints(),
      listAllEvents({ limit: 20 }),
      listAllRules(),
      listDLQ(),
    ]);
    setEndpoints(eps);
    setEvents(evts);
    setRules(rls);
    setDlqCount(dlq.length);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => { void load(); }, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [load]);

  const eventsToday = events.filter(e => {
    const d = new Date(e.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const healedToday = eventsToday.filter(e => e.status === 'healed').length;
  const activeRules = rules.filter(r => r.status === 'active').length;
  const pendingRules = rules.filter(r => r.status === 'pending').length;
  const healingRate = eventsToday.length > 0
    ? Math.round((eventsToday.filter(e => e.status !== 'dead').length / eventsToday.length) * 100)
    : 100;

  return (
    <div className="fade-up">
      <StatsCards
        eventsToday={eventsToday.length}
        healedToday={healedToday}
        activeRules={activeRules}
        pendingRules={pendingRules}
        dlqCount={dlqCount}
        healingRate={healingRate}
        loading={loading}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '16px' }}>
        <FlowDiagram endpoints={endpoints} events={events} />
        <RecentEvents events={events.slice(0, 8)} loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
        <ActivityChart events={events} />
        <AgentStatus rules={rules} />
      </div>
    </div>
  );
}
