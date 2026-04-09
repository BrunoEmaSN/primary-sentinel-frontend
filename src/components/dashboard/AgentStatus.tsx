'use client';

import type { TransformationRule } from '@/types';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function AgentStatus({ rules }: { rules: TransformationRule[] }) {
  const { dict } = useI18n();
  const a = dict.dashboard.agentStatus;
  const aiRules = rules.filter(r => r.source === 'ai' && r.status === 'active').length;

  const agents = [
    { name: a.detector,  key: 'detector' },
    { name: a.routing,   key: 'routing' },
    { name: a.healing,   key: 'healing' },
    { name: a.loader,    key: 'loader' },
    { name: a.dlq,       key: 'dlq' },
  ];

  return (
    <div className="sentinel-card">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
        {a.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {agents.map(agent => (
          <div key={agent.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{agent.name}</span>
            <span className="pill pill-active">{a.active}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{a.aiRules}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>{aiRules}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{a.modelLabel}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--teal)' }}>{a.modelValue}</span>
        </div>
      </div>
    </div>
  );
}
