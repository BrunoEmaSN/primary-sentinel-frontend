'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function LandingPricing() {
  const [yearly, setYearly] = useState(false);
  const { dict } = useI18n();
  const p = dict.landing.pricing;
  const plans = p.plans;

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
        <span style={{ fontSize: '12px', color: yearly ? 'var(--muted)' : 'var(--text)' }}>{p.monthly}</span>
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
          {p.yearly}{' '}
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{p.yearlyDiscount}</span>
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
        {plans.map((plan, idx) => {
          const monthly = idx === 0 ? 0 : idx === 1 ? 15 : 50;
          const yearlyPrice = idx === 0 ? 0 : idx === 1 ? 12 : 42;
          const price = yearly ? yearlyPrice : monthly;
          const highlight = idx === 1;
          const cardBg = highlight ? 'var(--bg2)' : 'var(--card)';
          const cardFg = 'var(--text)';
          const mutedCol = 'var(--muted)';
          const borderCol = highlight ? 'rgba(200,245,80,.35)' : 'var(--border)';
          const btnClass = highlight ? 'btn-primary' : 'btn-ghost';

          return (
            <div
              key={plan.name}
              className="sentinel-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: cardBg,
                color: cardFg,
                borderColor: borderCol,
                boxShadow: highlight ? '0 0 0 1px rgba(200,245,80,.12)' : undefined,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: mutedCol, marginBottom: '8px' }}>
                {plan.name}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                {price === 0 ? (
                  p.freePrice
                ) : (
                  <>
                    US${price}
                    <span style={{ fontSize: '13px', fontWeight: 500, color: mutedCol }}>{p.perMonth}</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: '12px', color: mutedCol, lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: '12px',
                      padding: '6px 0',
                      borderTop: `1px solid ${highlight ? 'rgba(200,245,80,.12)' : 'var(--border)'}`,
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
              <Link href="/auth" className={btnClass} style={{ textDecoration: 'none', justifyContent: 'center' }}>
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
