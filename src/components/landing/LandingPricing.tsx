'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSalesContact } from '@/components/SalesContactProvider';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { getPublicPricing, type PublicPricingCatalog } from '@/lib/api';

const PLAN_KEYS = ['basic', 'professional', 'enterprise'] as const;

const FALLBACK_USD: { monthly: number; yearlyPerMonth: number }[] = [
  { monthly: 0, yearlyPerMonth: 0 },
  { monthly: 15, yearlyPerMonth: 12 },
  { monthly: 50, yearlyPerMonth: 42 },
];

function amountsForPlanIndex(catalog: PublicPricingCatalog | null, idx: number) {
  const key = PLAN_KEYS[idx];
  const row = catalog?.plans?.find((p) => p.planKey === key);
  const fb = FALLBACK_USD[idx] ?? FALLBACK_USD[0]!;
  if (!row) return fb;
  return { monthly: row.monthlyUsd, yearlyPerMonth: row.yearlyPerMonthUsd };
}

export default function LandingPricing() {
  const [yearly, setYearly] = useState(false);
  const [catalog, setCatalog] = useState<PublicPricingCatalog | null>(null);
  const { dict, locale } = useI18n();
  const { openSalesContact, isSalesContactConfigured } = useSalesContact();
  const p = dict.landing.pricing;
  const plans = p.plans;

  useEffect(() => {
    void getPublicPricing().then((r) => {
      if (r.data) setCatalog(r.data);
    });
  }, []);

  const yearlyBadge =
    catalog?.yearlyCommitmentSavingsPercent != null
      ? `−${catalog.yearlyCommitmentSavingsPercent}%`
      : p.yearlyDiscount;

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
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{yearlyBadge}</span>
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
          const { monthly, yearlyPerMonth } = amountsForPlanIndex(catalog, idx);
          const price = yearly ? yearlyPerMonth : monthly;
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
                    US$
                    {Number.isInteger(price) ? price : price.toFixed(2)}
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
              {idx === 2 && isSalesContactConfigured ? (
                <button id="landing-pricing-enterprise-button" type="button" className={btnClass} onClick={openSalesContact} style={{ justifyContent: 'center' }}>
                  {plan.cta}
                </button>
              ) : (
                <Link href="/auth" className={btnClass} style={{ textDecoration: 'none', justifyContent: 'center' }}>
                  {plan.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {catalog?.discounts && catalog.discounts.length > 0 ? (
        <div
          style={{
            marginTop: '28px',
            padding: '16px 18px',
            borderRadius: '10px',
            border: '1px solid var(--border2)',
            background: 'var(--bg2)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px' }}>
            {locale === 'es' ? 'Promociones activas' : 'Active promotions'}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {catalog.discounts.map((d) => (
              <li key={d.code}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                  {d.label}{' '}
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>−{d.percentOff}%</span>
                </div>
                {d.description ? (
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.5 }}>{d.description}</div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
