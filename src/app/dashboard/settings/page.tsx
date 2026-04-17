'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { getPublicWorkerUrl, getTenantSettings, putTenantSettings, type TenantSettingsApi } from '@/lib/api';
import { allowPrices } from '@/lib/allowPrices';
import { useI18n } from '@/lib/i18n/I18nProvider';

type SectionProps = { title: string; children: ReactNode };
type RowProps = { label: string; sub?: string; children: ReactNode };

function Section({ title, children }: SectionProps) {
  return (
    <div className="sentinel-card" style={{ marginBottom: '16px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, sub, children }: RowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

const defaultSettings: TenantSettingsApi = {
  notify_email_healing: true,
  notify_email_dead: true,
  notify_email_pending_rules: true,
  slack_on_incidents: true,
  slack_incoming_webhook_url: null,
  alert_webhook_url: null,
  alert_webhook_secret: null,
  billing_plan: 'free',
};

export default function SettingsPage() {
  const { dict } = useI18n();
  const st = dict.dashboard.settings;
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [s, setS] = useState<TenantSettingsApi>(defaultSettings);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  useEffect(() => {
    void getTenantSettings().then((r) => {
      if (r.data) setS({ ...defaultSettings, ...r.data });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    const res = await putTenantSettings({
      notify_email_healing: s.notify_email_healing,
      notify_email_dead: s.notify_email_dead,
      notify_email_pending_rules: s.notify_email_pending_rules,
      slack_on_incidents: s.slack_on_incidents,
      slack_incoming_webhook_url: s.slack_incoming_webhook_url || null,
      alert_webhook_url: s.alert_webhook_url || null,
      alert_webhook_secret: s.alert_webhook_secret || null,
    });
    if (res.error) {
      alert(st.saveError.replace('{msg}', String(res.error)));
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="fade-up">
      <Section title="CUENTA">
        <Row label="Email" sub="Tu dirección de email registrada">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            {user?.email ?? '—'}
          </span>
        </Row>
        <Row label="Tenant ID" sub="Usalo en tus URLs de webhook">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)' }}>
              {user?.id?.slice(0, 16) ?? '—'}…
            </span>
            <button
              onClick={() => user && navigator.clipboard.writeText(user.id)}
              className="btn-ghost"
              style={{ fontSize: '9px', padding: '3px 8px' }}
            >
              Copiar
            </button>
          </div>
        </Row>
        <Row label="Plan" sub="Límite free: 1 endpoint activo (API)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill pill-active">{s.billing_plan.toUpperCase()}</span>
            {allowPrices ? (
              <Link href="/dashboard/billing" style={{ fontSize: '10px', color: 'var(--accent)' }}>
                Facturación
              </Link>
            ) : null}
          </div>
        </Row>
      </Section>

      <Section title="NOTIFICACIONES (Resend + Slack + webhook firmado)">
        {loading ? (
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{dict.dashboard.loading.preferences}</div>
        ) : (
          <>
            <Row label="Email en reparaciones" sub="Mismo resumen JSON/HTML que Slack y webhook">
              <input
                type="checkbox"
                checked={s.notify_email_healing}
                onChange={(e) => setS((x) => ({ ...x, notify_email_healing: e.target.checked }))}
              />
            </Row>
            <Row label="Email en DLQ" sub="Incidente crítico">
              <input
                type="checkbox"
                checked={s.notify_email_dead}
                onChange={(e) => setS((x) => ({ ...x, notify_email_dead: e.target.checked }))}
              />
            </Row>
            <Row label="Email en reglas pendientes" sub="Reservado para flujos de aprobación">
              <input
                type="checkbox"
                checked={s.notify_email_pending_rules}
                onChange={(e) => setS((x) => ({ ...x, notify_email_pending_rules: e.target.checked }))}
              />
            </Row>
            <Row label="Slack (Incoming Webhook)" sub="Mensaje de texto con el resumen">
              <input
                type="checkbox"
                checked={s.slack_on_incidents}
                onChange={(e) => setS((x) => ({ ...x, slack_on_incidents: e.target.checked }))}
              />
            </Row>
            <Row label="URL Slack" sub="https://hooks.slack.com/services/...">
              <input
                className="sentinel-input"
                style={{ width: '280px' }}
                placeholder="Webhook de Slack"
                value={s.slack_incoming_webhook_url ?? ''}
                onChange={(e) => setS((x) => ({ ...x, slack_incoming_webhook_url: e.target.value || null }))}
              />
            </Row>
            <Row label="Webhook de alertas (cliente)" sub="POST JSON firmado (HMAC-SHA256), distinto del webhook de ingesta">
              <input
                className="sentinel-input"
                style={{ width: '240px' }}
                placeholder="https://tu-api.com/sentinel/alerts"
                value={s.alert_webhook_url ?? ''}
                onChange={(e) => setS((x) => ({ ...x, alert_webhook_url: e.target.value || null }))}
              />
            </Row>
            <Row label="Secreto HMAC" sub="Cabecera X-Sentinel-Signature: sha256=...">
              <input
                className="sentinel-input"
                style={{ width: '200px' }}
                type="password"
                autoComplete="off"
                placeholder="secreto compartido"
                value={s.alert_webhook_secret ?? ''}
                onChange={(e) => setS((x) => ({ ...x, alert_webhook_secret: e.target.value || null }))}
              />
            </Row>
          </>
        )}
      </Section>

      <Section title="INFRAESTRUCTURA">
        <Row label="Backend URL" sub="Cloudflare Worker URL (ingesta webhooks; el dashboard usa proxy /worker-api)">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>{getPublicWorkerUrl()}</span>
        </Row>
        <Row label="Base de datos" sub="Supabase PostgreSQL">
          <span className="pill pill-active">CONECTADO</span>
        </Row>
        <Row label="Cache (Redis)" sub="Upstash Redis para reglas en caché">
          <span className="pill pill-active">CONECTADO</span>
        </Row>
        <Row label="Storage (DLQ)" sub="Cloudflare R2">
          <span className="pill pill-active">CONECTADO</span>
        </Row>
        <div style={{ paddingTop: '0', borderBottom: 'none' }}>
          <Row label="Email (Resend)" sub="Para notificaciones">
            <span className="pill pill-active">CONECTADO</span>
          </Row>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={() => void handleSave()} disabled={loading}>
          {saved ? st.saved : st.saveButton}
        </button>
      </div>
    </div>
  );
}
