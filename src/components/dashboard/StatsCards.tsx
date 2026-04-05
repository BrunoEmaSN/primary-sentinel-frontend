'use client';

interface Props {
  eventsToday: number;
  healedToday: number;
  activeRules: number;
  pendingRules: number;
  dlqCount: number;
  healingRate: number;
  loading: boolean;
}

function MetricCard({
  label, value, sub, accent, loading,
}: {
  label: string; value: string | number; sub: string; accent: string; loading: boolean;
}) {
  return (
    <div className="sentinel-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
      <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: accent, lineHeight: 1 }}>
        {loading ? '—' : value}
      </div>
      <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '5px' }}>{sub}</div>
    </div>
  );
}

export default function StatsCards({ eventsToday, healedToday, activeRules, pendingRules, dlqCount, healingRate, loading }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
      <MetricCard
        label="Eventos hoy"
        value={eventsToday.toLocaleString()}
        sub={`${healingRate}% procesados OK`}
        accent="var(--accent)"
        loading={loading}
      />
      <MetricCard
        label="Auto-reparados"
        value={healedToday}
        sub={`Tasa éxito ${healingRate}%`}
        accent="var(--blue)"
        loading={loading}
      />
      <MetricCard
        label="Reglas activas"
        value={activeRules}
        sub={pendingRules > 0 ? `${pendingRules} pendientes aprobación` : 'Todo aprobado'}
        accent="var(--amber)"
        loading={loading}
      />
      <MetricCard
        label="Cola DLQ"
        value={dlqCount}
        sub={dlqCount > 0 ? 'Requieren revisión' : 'Sin eventos críticos'}
        accent={dlqCount > 0 ? 'var(--red)' : 'var(--teal)'}
        loading={loading}
      />
    </div>
  );
}
