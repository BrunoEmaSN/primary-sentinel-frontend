'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import SentinelBrand from '@/components/SentinelBrand';
import { IconArrowRight } from '@/components/icons/Arrows';
import LandingPricing from '@/components/landing/LandingPricing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { allowPrices } from '@/lib/allowPrices';

const gridBg = {
  position: 'fixed' as const,
  inset: 0,
  opacity: 0.03,
  backgroundImage:
    'linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  pointerEvents: 'none' as const,
};

/** Debe coincidir con `gap` en `.landing-trust-track` / `.landing-trust-strip` (globals.css). */
const TRUST_MARQUEE_GAP_PX = 12;

const trustPillStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--muted)',
  padding: '10px 16px',
  border: '1px solid var(--border2)',
  borderRadius: '8px',
  background: 'var(--bg2)',
  flexShrink: 0,
} as const;

function TrustLogoMarquee({ brands }: { brands: readonly string[] }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  /** Desplazamiento exacto de un ciclo: ancho de la primera tira + gap entre tiras (bucle sin salto). */
  const [shiftPx, setShiftPx] = useState<number | null>(null);
  /** Tiras idénticas en fila: al menos tantas como cubran el ancho visible + margen (evita huecos). */
  const [stripCopies, setStripCopies] = useState(2);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    const strip = stripRef.current;
    if (!container || !strip) return;

    const update = () => {
      const w = strip.offsetWidth;
      const g = TRUST_MARQUEE_GAP_PX;
      if (w <= 0) return;
      const moduleW = w + g;
      setShiftPx(moduleW);
      const cw = container.clientWidth;
      const needed = Math.max(2, Math.ceil(cw / moduleW) + 2);
      setStripCopies(needed);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(strip);
    return () => ro.disconnect();
  }, [brands, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: `${TRUST_MARQUEE_GAP_PX}px`,
          opacity: 0.85,
        }}
      >
        {brands.map((name) => (
          <div key={name} style={trustPillStyle}>
            {name}
          </div>
        ))}
      </div>
    );
  }

  const durationSec =
    shiftPx != null && shiftPx > 0 ? Math.max(20, shiftPx / 22) : 42;

  const trackStyle =
    shiftPx != null && shiftPx > 0
      ? ({
          ['--landing-trust-shift' as string]: `${shiftPx}px`,
          ['--landing-trust-duration' as string]: `${durationSec}s`,
        } as React.CSSProperties)
      : undefined;

  return (
    <div ref={containerRef} className="landing-trust-marquee" style={{ opacity: 0.85 }}>
      <div className="landing-trust-track" style={trackStyle}>
        {Array.from({ length: stripCopies }, (_, stripIdx) => (
          <div
            key={stripIdx}
            ref={stripIdx === 0 ? stripRef : undefined}
            className="landing-trust-strip"
            aria-hidden={stripIdx > 0 ? true : undefined}
          >
            {brands.map((name, i) => (
              <div key={`${stripIdx}-${name}-${i}`} style={trustPillStyle}>
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionTitle = (kicker: string, title: string, subtitle?: string) => (
  <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
    <h2
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--accent)',
        marginBottom: '12px',
      }}
    >
      {kicker}
    </h2>
    <h3
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
        fontWeight: 600,
        letterSpacing: '-0.03em',
        lineHeight: 1.25,
        color: 'var(--text)',
        marginBottom: subtitle ? '12px' : 0,
      }}
    >
      {title}
    </h3>
    {subtitle ? (
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>{subtitle}</p>
    ) : null}
  </div>
);

function HeroDashboardMock() {
  const { dict } = useI18n();
  const hm = dict.landing.heroMock;
  const rows = hm.rows;
  return (
    <div
      className="sentinel-card"
      style={{
        marginTop: '40px',
        padding: 0,
        overflow: 'hidden',
        maxWidth: '920px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '12px',
        boxShadow: '0 24px 80px rgba(0,0,0,.45)',
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg2)',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginLeft: '8px' }}>
          {hm.windowTitle}
        </span>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table className="sentinel-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>{hm.colEndpoint}</th>
              <th>{hm.colState}</th>
              <th>{hm.colLast}</th>
              <th>{hm.colHeal}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{r.name}</td>
                <td>
                  <span
                    className="pill"
                    style={{
                      fontSize: '9px',
                      ...(r.status === 'ok'
                        ? { background: 'rgba(20,184,166,.12)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,.25)' }
                        : r.status === 'warn'
                          ? { background: 'rgba(245,158,11,.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,.25)' }
                          : { background: 'rgba(200,245,80,.1)', color: 'var(--accent)', border: '1px solid rgba(200,245,80,.25)' }),
                    }}
                  >
                    {r.status === 'ok' ? hm.statusOk : r.status === 'warn' ? hm.statusWarn : hm.statusHealed}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '11px' }}>{r.last}</td>
                <td style={{ color: 'var(--muted)', fontSize: '11px' }}>{r.heal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '9px', color: 'var(--muted)', padding: '8px 14px 12px', margin: 0, fontFamily: 'var(--font-mono)' }}>
          {hm.footerNote}
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t, dict } = useI18n();
  const L = dict.landing;
  const faqSubtitle = allowPrices ? L.faqSubtitle : L.faqSubtitleNoPrices;
  const faqItems = useMemo(() => {
    if (allowPrices) return [...L.faqItems];
    return L.faqItems.slice(0, -1).map((item, i) => {
      if (i === 3) return { ...item, a: L.faqDataAnswerNoPrices };
      if (i === 4) return { ...item, a: L.faqTrialAnswerNoPrices };
      return item;
    });
  }, [L, allowPrices]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <div style={gridBg} aria-hidden />

      <header
        style={{
          position: 'relative',
          zIndex: 1,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10, 11, 13, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <SentinelBrand variant="landing" />
          </Link>
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {[
              ['#producto', t('landing.navProduct')],
              ['#features', t('landing.navFeatures')],
              ...(allowPrices ? ([['#pricing', t('landing.navPricing')]] as const) : []),
              ['#faq', t('landing.navFaq')],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  padding: '6px 10px',
                }}
              >
                {label}
              </a>
            ))}
            <LanguageSwitcher variant="compact" />
            <Link href="/auth" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '11px' }}>
              {t('landing.signIn')}
            </Link>
          </nav>
        </div>
      </header>

      <main className="fade-up" style={{ position: 'relative', zIndex: 1 }}>
        <section
          id="producto"
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            padding: '72px 20px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <span className="pill pill-active" style={{ fontSize: '9px' }}>
              {t('landing.kicker')}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.85rem, 4.5vw, 2.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '16px',
              color: 'var(--text)',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {t('landing.heroTitle')}
          </h1>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'var(--muted)',
              marginBottom: '28px',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {t('landing.heroSubtitle')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <Link href="/auth" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 22px' }}>
              {t('landing.ctaStart')}
            </Link>
            <a
              href="#features"
              className="btn-ghost"
              style={{ textDecoration: 'none', padding: '12px 22px', fontSize: '11px' }}
            >
              {t('landing.ctaSecondary')}
            </a>
          </div>
          <HeroDashboardMock />
        </section>

        {/* Métricas */}
        <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 48px' }}>
          <div
            className="sentinel-card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            {L.metricsRows.map((m) => (
              <div key={m.l}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
                  {m.v}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.45 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>
            {L.metricsCaption}
          </p>
        </section>

        {/* Logo cloud */}
        {/* <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 20px 56px' }}>
          {sectionTitle(L.trustKicker, L.trustTitle, L.trustSubtitle)}
          <TrustLogoMarquee brands={L.trustBrands} />
          <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)', marginTop: '14px', fontFamily: 'var(--font-mono)' }}>
            {L.trustFootnote}
          </p>
        </section> */}

        {/* Capacidades: flujo 1–4 (antes “pilares” demasiado abstractos) */}
        <section
          id="features"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 20px 64px',
          }}
        >
          {sectionTitle(L.featuresKicker, L.featuresTitle, L.featuresSubtitle)}
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            {/* 1 — Contexto humano */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>{L.step1Badge}</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{L.step1Side}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                {L.step1Title}
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                {L.step1Body}
              </p>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}>{L.step1TagsTitle}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {L.step1Tags.map((item, i) => (
                  <div
                    key={item.t}
                    title={item.hint}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      transform: `rotate(${i % 2 === 0 ? -1 : 0.8}deg)`,
                      background: i === 0 ? 'rgba(200,245,80,.12)' : i === 1 ? 'rgba(59,130,246,.12)' : 'rgba(245,158,11,.1)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text)',
                    }}
                  >
                    {item.t}
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Ventanas */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>{L.step2Badge}</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{L.step2Side}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                {L.step2Title}
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                {L.step2BodyLead}{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{L.step2BodyStrong}</strong> {L.step2BodyTail}
              </p>
              <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  {L.step2ExampleLabel}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text)', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                  {L.step2ExampleWindow}
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border2)', marginBottom: '8px', position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '42%',
                      height: '100%',
                      background: 'rgba(200,245,80,.35)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: '10px', color: 'var(--muted)' }}>{L.step2Request}</div>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(200,245,80,.15)',
                      border: '1px solid rgba(200,245,80,.35)',
                      color: 'var(--accent)',
                    }}
                  >
                    {L.step2Approved}
                  </div>
                </div>
              </div>
            </div>

            {/* 3 — Mismo informe a todos */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>{L.step3Badge}</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{L.step3Side}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                {L.step3Title}
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                {L.step3BodyLead} <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{L.step3BodyStrong}</strong>
                {L.step3BodyTail}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  background: 'var(--bg2)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border2)',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text)',
                  }}
                >
                  {L.step3OneReport}
                </div>
                <IconArrowRight size={14} style={{ color: 'var(--muted)' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {L.step3Channels.map((name) => (
                    <div
                      key={name}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        background: 'var(--card)',
                        border: '1px solid var(--border2)',
                        color: 'var(--muted)',
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 — Recuperación */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>{L.step4Badge}</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{L.step4Side}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                {L.step4Title}
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                {L.step4BodyLead}{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{L.step4BodyStrong}</strong>
                {L.step4BodyTail}
              </p>
              <div style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, var(--red) 0%, var(--amber) 45%, var(--accent) 100%)',
                    opacity: 0.85,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>{L.step4BarLeft}</span>
                  <span>{L.step4BarMid}</span>
                  <span>{L.step4BarRight}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {L.step4Chips.map((label) => (
                  <span
                    key={label}
                    style={{
                      fontSize: '10px',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      background: 'rgba(200,245,80,.08)',
                      border: '1px solid rgba(200,245,80,.2)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {label}
                  </span>
                ))}
                <span style={{ fontSize: '18px', color: 'var(--accent)' }} aria-hidden>↺</span>
              </div>
            </div>
          </div>
        </section>

        {/* Split operations */}
        <section id="operations" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 64px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: 'var(--accent)',
                  marginBottom: '12px',
                }}
              >
                {L.operationsKicker}
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  color: 'var(--text)',
                }}
              >
                {L.operationsTitle}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {L.operationsBullets.map((line) => (
                  <li key={line} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.55, color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>—</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sentinel-card" style={{ padding: '20px', minHeight: '280px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '16px' }}>
                {L.operationsMockTitle}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {L.operationsMockSteps.map((step) => (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '72px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      {step.label}
                    </div>
                    <div style={{ flex: 1, height: '36px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: step.w,
                          background: 'linear-gradient(90deg, rgba(200,245,80,.15), rgba(59,130,246,.1))',
                          borderRight: '1px solid rgba(200,245,80,.25)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(200,245,80,.06)',
                  border: '1px dashed rgba(200,245,80,.25)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{L.operationsMockSuggestion}</span>
                {' · '}
                {L.operationsMockHint}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        {/* <section style={{ maxWidth: '880px', margin: '0 auto', padding: '0 20px 64px' }}>
          <div
            className="sentinel-card"
            style={{
              padding: '36px 28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '28px',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.55, color: 'var(--text)', fontWeight: 500 }}>
                {L.testimonialQuote}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--border2), var(--bg3))',
                  border: '2px solid var(--border2)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)' }}>{L.testimonialName}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{L.testimonialRole}</div>
              </div>
            </div>
          </div>
        </section> */}

        {allowPrices ? (
          <section id="pricing" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 20px 64px' }}>
            {sectionTitle(L.pricingKicker, L.pricingTitle, L.pricingSubtitle)}
            <LandingPricing />
          </section>
        ) : null}

        {/* FAQ */}
        <section id="faq" style={{ maxWidth: '920px', margin: '0 auto', padding: '0 20px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                  marginBottom: '8px',
                }}
              >
                {L.faqTitle}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55 }}>
                {faqSubtitle}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="sentinel-card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                >
                  <summary
                    className="[&::-webkit-details-marker]:hidden"
                    style={{
                      padding: '14px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {item.q}
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 16px 14px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section
          style={{
            position: 'relative',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '64px 20px',
            textAlign: 'center',
            background: 'var(--bg2)',
            backgroundImage:
              'linear-gradient(rgba(42,52,68,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(42,52,68,.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                color: 'var(--text)',
              }}
            >
              {L.ctaTitle}
            </h2>
            <Link href="/auth" className="btn-primary justify-center" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '12px' }}>
              {L.ctaButton}
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--border)',
          padding: '40px 20px 28px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '28px',
            marginBottom: '32px',
          }}
        >
          <div>
            <SentinelBrand variant="landing" />
            <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.55, marginTop: '12px', maxWidth: '240px' }}>
              {t('landing.footerTagline')}
            </p>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.1em' }}>
              {t('landing.footerProduct')}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#features" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  {t('landing.footerCapabilities')}
                </a>
              </li>
              {allowPrices ? (
                <li>
                  <a href="#pricing" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                    {t('landing.footerPricing')}
                  </a>
                </li>
              ) : null}
              <li>
                <a href="#faq" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  {t('landing.footerFaq')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.1em' }}>
              {t('landing.footerAccount')}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/auth" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  {t('landing.footerSignIn')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  {t('landing.footerPanel')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.1em' }}>
              {t('landing.footerLegal')}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/legal/terms" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  {t('landing.footerTerms')}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  {t('landing.footerPrivacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          {L.footerCopyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
      </footer>

    </div>
  );
}
