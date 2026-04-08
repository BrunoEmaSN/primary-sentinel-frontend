'use client';

import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: 'Básico',
    desc: 'Para probar el flujo end-to-end.',
    monthly: 0,
    yearly: 0,
    cta: 'Probar gratis',
    href: '/auth',
    highlight: false,
    features: ['1 pipeline activo', 'Alertas por email', 'Panel de observabilidad'],
  },
  {
    name: 'Profesional',
    desc: 'Para equipos que ya están en producción.',
    monthly: 15,
    yearly: 12,
    cta: 'Empezar ahora',
    href: '/auth',
    highlight: true,
    features: ['Pipelines ilimitados', 'Auto-reparación con IA', 'Reglas y DLQ', 'Soporte prioritario'],
  },
  {
    name: 'Empresa',
    desc: 'SLA, SSO y despliegue dedicado.',
    monthly: 50,
    yearly: 42,
    cta: 'Hablar con ventas',
    href: '/auth',
    highlight: false,
    features: ['Todo lo anterior', 'SSO / SAML', 'Entorno dedicado', 'Account manager'],
  },
];

export default function LandingPricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '12px', color: yearly ? 'var(--muted)' : 'var(--text)' }}>Mensual</span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly(!yearly)}
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '999px',
            border: '1px solid var(--border2)',
            background: yearly ? 'rgba(200,245,80,.2)' : 'var(--bg2)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '3px',
              left: yearly ? '22px' : '3px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--accent)',
              transition: 'left 0.2s',
            }}
          />
        </button>
        <span style={{ fontSize: '12px', color: yearly ? 'var(--text)' : 'var(--muted)' }}>
          Anual <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>−20%</span>
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          alignItems: 'stretch',
        }}
      >
        {plans.map((p) => {
          const price = yearly ? p.yearly : p.monthly;
          const cardBg = p.highlight ? 'var(--bg2)' : 'var(--card)';
          const cardFg = 'var(--text)';
          const mutedCol = 'var(--muted)';
          const borderCol = p.highlight ? 'rgba(200,245,80,.35)' : 'var(--border)';
          const btnClass = p.highlight ? 'btn-primary' : 'btn-ghost';

          return (
            <div
              key={p.name}
              className="sentinel-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: cardBg,
                color: cardFg,
                borderColor: borderCol,
                boxShadow: p.highlight ? '0 0 0 1px rgba(200,245,80,.12)' : undefined,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: mutedCol, marginBottom: '8px' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                {price === 0 ? (
                  'US$0'
                ) : (
                  <>
                    US${price}
                    <span style={{ fontSize: '13px', fontWeight: 500, color: mutedCol }}>/mes</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '12px', color: mutedCol, lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                {p.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: '12px',
                      padding: '6px 0',
                      borderTop: `1px solid ${p.highlight ? 'rgba(200,245,80,.12)' : 'var(--border)'}`,
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={btnClass} style={{ textDecoration: 'none', justifyContent: 'center' }}>
                {p.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
