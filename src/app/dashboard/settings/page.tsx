'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { getPublicWorkerUrl, getTenantSettings, putTenantSettings, type TenantSettingsApi } from '@/lib/api';
import { allowPrices } from '@/lib/allowPrices';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { toast } from 'sonner';

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
  const p = dict.dashboard.settingsPage;
  const ui = dict.dashboard.ui;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
    try {
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
        toast.error(st.saveError.replace('{msg}', String(res.error)));
        return;
      }
      toast.success(st.saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-up">
      <Section title={p.sectionAccount}>
        <Row label={p.rowEmail} sub={p.rowEmailSub}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            {user?.email ?? ui.emDash}
          </span>
        </Row>
        <Row label={p.rowTenantId} sub={p.rowTenantIdSub}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)' }}>
              {user?.id?.slice(0, 16) ?? ui.emDash}…
            </span>
            <button
              onClick={() => user && navigator.clipboard.writeText(user.id)}
              className="btn-ghost"
              style={{ fontSize: '9px', padding: '3px 8px' }}
            >
              {ui.copy}
            </button>
          </div>
        </Row>
        <Row label={p.rowPlan} sub={p.rowPlanSub}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill pill-active">{s.billing_plan.toUpperCase()}</span>
            {allowPrices ? (
              <Link href="/dashboard/billing" style={{ fontSize: '10px', color: 'var(--accent)' }}>
                {p.billingLink}
              </Link>
            ) : null}
          </div>
        </Row>
      </Section>

      <Section title={p.sectionNotifications}>
        {loading ? (
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{dict.dashboard.loading.preferences}</div>
        ) : (
          <>
            <Row label={p.notifyHeal} sub={p.notifyHealSub}>
              <input
                type="checkbox"
                checked={s.notify_email_healing}
                onChange={(e) => setS((x) => ({ ...x, notify_email_healing: e.target.checked }))}
              />
            </Row>
            <Row label={p.notifyDead} sub={p.notifyDeadSub}>
              <input
                type="checkbox"
                checked={s.notify_email_dead}
                onChange={(e) => setS((x) => ({ ...x, notify_email_dead: e.target.checked }))}
              />
            </Row>
            <Row label={p.notifyPending} sub={p.notifyPendingSub}>
              <input
                type="checkbox"
                checked={s.notify_email_pending_rules}
                onChange={(e) => setS((x) => ({ ...x, notify_email_pending_rules: e.target.checked }))}
              />
            </Row>
            <Row label={p.slackToggle} sub={p.slackToggleSub}>
              <input
                type="checkbox"
                checked={s.slack_on_incidents}
                onChange={(e) => setS((x) => ({ ...x, slack_on_incidents: e.target.checked }))}
              />
            </Row>
            <Row label={p.slackUrl} sub={p.slackUrlSub}>
              <input
                className="sentinel-input"
                style={{ width: '280px' }}
                placeholder={p.slackPlaceholder}
                value={s.slack_incoming_webhook_url ?? ''}
                onChange={(e) => setS((x) => ({ ...x, slack_incoming_webhook_url: e.target.value || null }))}
              />
            </Row>
            <Row label={p.alertWebhook} sub={p.alertWebhookSub}>
              <input
                className="sentinel-input"
                style={{ width: '240px' }}
                placeholder={p.alertWebhookPlaceholder}
                value={s.alert_webhook_url ?? ''}
                onChange={(e) => setS((x) => ({ ...x, alert_webhook_url: e.target.value || null }))}
              />
            </Row>
            <Row label={p.hmacSecret} sub={p.hmacSecretSub}>
              <input
                className="sentinel-input"
                style={{ width: '200px' }}
                type="password"
                autoComplete="off"
                placeholder={p.hmacPlaceholder}
                value={s.alert_webhook_secret ?? ''}
                onChange={(e) => setS((x) => ({ ...x, alert_webhook_secret: e.target.value || null }))}
              />
            </Row>
          </>
        )}
      </Section>

      <Section title={p.sectionInfra}>
        <Row label={p.backendUrl} sub={p.backendUrlSub}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>{getPublicWorkerUrl()}</span>
        </Row>
        <Row label={p.database} sub={p.databaseSub}>
          <span className="pill pill-active">{p.statusConnected}</span>
        </Row>
        <Row label={p.cacheRedis} sub={p.cacheRedisSub}>
          <span className="pill pill-active">{p.statusConnected}</span>
        </Row>
        <Row label={p.storageDlq} sub={p.storageDlqSub}>
          <span className="pill pill-active">{p.statusConnected}</span>
        </Row>
        <div style={{ paddingTop: '0', borderBottom: 'none' }}>
          <Row label={p.emailResend} sub={p.emailResendSub}>
            <span className="pill pill-active">{p.statusConnected}</span>
          </Row>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={() => void handleSave()} disabled={loading || saving}>
          {saving ? st.saving : st.saveButton}
        </button>
      </div>
    </div>
  );
}
