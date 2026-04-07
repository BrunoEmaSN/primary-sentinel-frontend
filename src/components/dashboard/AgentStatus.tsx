'use client';

import type { TransformationRule } from '@/types';

const agents = [
  { name: 'Agente de detección',  key: 'detector' },
  { name: 'RoutingAgent',         key: 'routing' },
  { name: 'HealingAgent (LLM)',   key: 'healing' },
  { name: 'RetaLoader / DataLoader', key: 'loader' },
  { name: 'Dead Letter Queue',    key: 'dlq' },
];

export default function AgentStatus({ rules }: { rules: TransformationRule[] }) {
  const aiRules = rules.filter(r => r.source === 'ai' && r.status === 'active').length;

  return (
    <div className="sentinel-card">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
        PRIMARY SENTINEL · ESTADO
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {agents.map(agent => (
          <div key={agent.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{agent.name}</span>
            <span className="pill pill-active">ACTIVO</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Reglas generadas por IA</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>{aiRules}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Modelo base</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--teal)' }}>claude-sonnet</span>
        </div>
      </div>
    </div>
  );
}
