'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBillingStatus, getPublicPricing, type PublicPricingCatalog } from '@/lib/api';
import { IconArrowLeft } from '@/components/icons/Arrows';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function BillingPageClient() {
  const { dict } = useI18n();
  const b = dict.dashboard.billing;
  const ui = dict.dashboard.ui;
  const [plan, setPlan] = useState<string>(ui.emDash);
  const [note, setNote] = useState<string>('');
  const [catalog, setCatalog] = useState<PublicPricingCatalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    void getBillingStatus().then((r) => {
      if (r.data?.plan) setPlan(r.data.plan);
      if (r.data?.note) setNote(r.data.note);
    });
  }, []);

  useEffect(() => {
    void getPublicPricing().then((r) => {
      if (r.data) {
        setCatalog(r.data);
        setCatalogError(null);
      } else if (r.error) {
        setCatalogError(r.error);
      }
    });
  }, []);

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{b.title}</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.55 }}>
          {b.currentPlan} <span style={{ color: 'var(--accent)' }}>{plan}</span>
          {note ? (
            <>
              <br />
              {note}
            </>
          ) : null}
        </div>
        <p style={{ fontSize: '11px', marginTop: '14px', color: 'var(--muted)' }}>
          {b.roadmapNote}
        </p>
        <Link
          href="/dashboard/settings"
          className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '11px' }}
        >
          <IconArrowLeft size={14} />
          {b.backSettings}
        </Link>
      </div>

      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{b.pricingTitle}</div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.55 }}>
          {b.pricingIntro}
        </p>
        {catalogError ? (
          <p style={{ fontSize: '11px', marginTop: '10px', color: 'var(--amber)' }}>
            {b.catalogError.replace('{msg}', catalogError)}
          </p>
        ) : null}
        {catalog?.plans && catalog.plans.length > 0 ? (
          <table className="sentinel-table" style={{ marginTop: '14px' }}>
            <thead>
              <tr>
                <th>{b.thPlan}</th>
                <th>{b.thMonthly}</th>
                <th>{b.thYearly}</th>
              </tr>
            </thead>
            <tbody>
              {catalog.plans.map((p) => (
                <tr key={p.planKey}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{p.planKey}</td>
                  <td>{p.monthlyUsd}</td>
                  <td>{p.yearlyPerMonthUsd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {catalog?.yearlyCommitmentSavingsPercent != null ? (
          <p style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
            {b.yearlySavings.replace('{pct}', String(catalog.yearlyCommitmentSavingsPercent))}
          </p>
        ) : null}
        {catalog?.discounts && catalog.discounts.length > 0 ? (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>{b.promotions}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {catalog.discounts.map((d) => (
                <li
                  key={d.code}
                  style={{
                    fontSize: '11px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg2)',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{d.label}</span>{' '}
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>−{d.percentOff}%</span>
                    <span style={{ color: 'var(--muted)', fontSize: '10px', marginLeft: '8px' }}>
                      ({d.billingPeriod}
                      {d.appliesToPlanKeys?.length ? ` · ${d.appliesToPlanKeys.join(', ')}` : ''})
                    </span>
                  </div>
                  {d.description ? <div style={{ marginTop: '6px', color: 'var(--muted)', lineHeight: 1.5 }}>{d.description}</div> : null}
                  {Object.keys(d.eligibility).length > 0 ? (
                    <div style={{ marginTop: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                      {JSON.stringify(d.eligibility)}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
