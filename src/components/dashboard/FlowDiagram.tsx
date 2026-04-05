'use client';

import type { RawEvent, Endpoint } from '@/types';

interface Props {
  endpoints: Endpoint[];
  events: RawEvent[];
}

export default function FlowDiagram({ endpoints, events }: Props) {
  const recentStatuses = events.slice(0, 5).map(e => e.status);
  const hasHealed = recentStatuses.includes('healed');
  const hasDead = recentStatuses.includes('dead');

  const healLineColor = hasHealed ? '#c8f550' : '#2a3444';
  const deadLineColor = hasDead ? '#ef4444' : '#2a3444';

  return (
    <div className="sentinel-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>FLUJO ACTIVO</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
            {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configurados
          </div>
        </div>
        <span className="pill pill-active">● LIVE</span>
      </div>

      <div style={{ background: 'var(--bg2)', borderRadius: '8px', overflow: 'hidden' }}>
        <svg width="100%" viewBox="0 0 620 230" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
          </defs>

          {/* Lines */}
          <line x1="100" y1="65" x2="175" y2="65" stroke="#2a3444" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <line x1="100" y1="165" x2="175" y2="165" stroke="#2a3444" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <line x1="285" y1="65" x2="355" y2="110" stroke={healLineColor} strokeWidth="1.5" markerEnd="url(#arr)" style={{ transition: 'stroke 0.5s' }}/>
          <line x1="285" y1="165" x2="355" y2="130" stroke="#2a3444" strokeWidth="1.5" markerEnd="url(#arr)"/>
          <line x1="465" y1="115" x2="510" y2="115" stroke={deadLineColor} strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray={hasDead ? '4 3' : 'none'} style={{ transition: 'stroke 0.5s' }}/>
          <line x1="465" y1="100" x2="510" y2="75" stroke={healLineColor} strokeWidth="1.5" markerEnd="url(#arr)" style={{ transition: 'stroke 0.5s' }}/>

          {/* HEALED label */}
          {hasHealed && (
            <text x="308" y="78" fill="#c8f550" fontSize="7" fontFamily="Space Mono, monospace" fontWeight="700">HEALED ✦</text>
          )}

          {/* Nodes */}
          {/* process_order */}
          <g>
            <rect x="10" y="44" width="90" height="42" rx="6" fill="#14171c" stroke="#2a3444" strokeWidth="1"/>
            <text x="18" y="60" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">process</text>
            <text x="18" y="70" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">_order</text>
            <rect x="18" y="76" width="56" height="7" rx="1.5" fill="rgba(200,245,80,.1)"/>
            <text x="21" y="81" fill="#c8f550" fontSize="6" fontFamily="Space Mono, monospace" fontWeight="700">order_event</text>
          </g>

          {/* betaCalculator */}
          <g>
            <rect x="10" y="144" width="90" height="42" rx="6" fill="#14171c" stroke="#2a3444" strokeWidth="1"/>
            <text x="18" y="160" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">betaCalc</text>
            <text x="18" y="170" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">ulator</text>
            <rect x="18" y="176" width="48" height="7" rx="1.5" fill="rgba(245,158,11,.1)"/>
            <text x="21" y="181" fill="#f59e0b" fontSize="6" fontFamily="Space Mono, monospace" fontWeight="700">TAX_PIPE</text>
          </g>

          {/* RoutingAgent */}
          <g>
            <rect x="175" y="44" width="110" height="42" rx="6" fill="#14171c" stroke="#2a3444" strokeWidth="1"/>
            <text x="183" y="60" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">RoutingAgent</text>
            <text x="183" y="70" fill="#6b7a8d" fontSize="7" fontFamily="DM Sans, sans-serif">Repara con reglas IA</text>
            <rect x="183" y="76" width="68" height="7" rx="1.5" fill="rgba(59,130,246,.1)"/>
            <text x="186" y="81" fill="#3b82f6" fontSize="6" fontFamily="Space Mono, monospace" fontWeight="700">validation_error</text>
          </g>

          {/* betaCalculator line 2 */}
          <g>
            <rect x="175" y="144" width="110" height="42" rx="6" fill="#14171c" stroke="#2a3444" strokeWidth="1"/>
            <text x="183" y="160" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">DataValidator</text>
            <text x="183" y="170" fill="#6b7a8d" fontSize="7" fontFamily="DM Sans, sans-serif">Zod schema check</text>
            <rect x="183" y="176" width="56" height="7" rx="1.5" fill="rgba(200,245,80,.1)"/>
            <text x="186" y="181" fill="#c8f550" fontSize="6" fontFamily="Space Mono, monospace" fontWeight="700">validated</text>
          </g>

          {/* RetaLoader */}
          <g>
            <rect x="355" y="90" width="110" height="50" rx="6" fill="#14171c" stroke={healLineColor} strokeWidth="1" style={{ transition: 'stroke 0.5s' }}/>
            <text x="363" y="108" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">RetaLoader</text>
            <text x="363" y="118" fill="#6b7a8d" fontSize="7" fontFamily="DM Sans, sans-serif">Inserta en DB</text>
            <rect x="363" y="128" width="60" height="7" rx="1.5" fill="rgba(20,184,166,.1)"/>
            <text x="366" y="133" fill="#14b8a6" fontSize="6" fontFamily="Space Mono, monospace" fontWeight="700">validated_data</text>
          </g>

          {/* DeadLetterQ */}
          <g>
            <rect x="510" y="55" width="95" height="40" rx="6" fill="#14171c" stroke={deadLineColor} strokeWidth="1" style={{ transition: 'stroke 0.5s' }}/>
            <text x="518" y="71" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">DeadLetterQ</text>
            <text x="518" y="82" fill="#6b7a8d" fontSize="7" fontFamily="DM Sans, sans-serif">Irrecuperables</text>
          </g>

          {/* DataLoader (DB) */}
          <g>
            <rect x="510" y="95" width="95" height="40" rx="6" fill="#14171c" stroke="#2a3444" strokeWidth="1"/>
            <text x="518" y="111" fill="#e8eaed" fontSize="8" fontFamily="Space Mono, monospace" fontWeight="700">DataLoader</text>
            <text x="518" y="122" fill="#6b7a8d" fontSize="7" fontFamily="DM Sans, sans-serif">→ Supabase DB</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
