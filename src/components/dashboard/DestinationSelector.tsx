'use client';

import React from 'react';
import { DESTINATION_CONFIGS, type DestinationType } from '@/types/destinations';

interface DestinationSelectorProps {
  selected: DestinationType | null;
  onChange: (type: DestinationType) => void;
  disabled?: boolean;
}

export function DestinationSelector({ selected, onChange, disabled }: DestinationSelectorProps) {
  const types = Object.entries(DESTINATION_CONFIGS) as Array<[DestinationType, typeof DESTINATION_CONFIGS[DestinationType]]>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>
          DESTINO DE SALIDA
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {types.map(([type, config]) => (
          <button
            key={type}
            type="button"
            disabled={disabled}
            onClick={() => onChange(type)}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: selected === type ? '2px solid var(--accent)' : '1px solid var(--border)',
              background: selected === type ? 'rgba(34,197,94,.08)' : 'var(--bg2)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              transition: 'all 200ms',
              textAlign: 'left',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
          >
            <div style={{ fontSize: '16px', marginBottom: '4px' }}>{config.icon}</div>
            <div style={{ fontWeight: 500, fontSize: '12px', marginBottom: '2px', color: 'var(--text)' }}>
              {config.label}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
              {config.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
