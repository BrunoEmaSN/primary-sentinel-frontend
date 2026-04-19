'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getPublicWorkerUrl,
  listEndpoints,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  listEvents,
} from '@/lib/api';
import type { Dictionary } from '@/lib/i18n/messages';
import type { Endpoint } from '@/types';
import {
  DESTINATION_CONFIGS,
  type Destination,
  type DestinationType,
  createEmptyDestination,
} from '@/types/destinations';
import { validateDestinationRequiredFields } from '@/lib/destinationValidation';
import { DestinationSelector } from '@/components/dashboard/DestinationSelector';
import { DestinationConfigForm } from '@/components/dashboard/DestinationConfigForm';
import { IconArrowRight } from '@/components/icons/Arrows';
import { useI18n } from '@/lib/i18n/I18nProvider';
import SentinelModal from '@/components/SentinelModal';

type DestSlot = {
  id: string;
  type: DestinationType | null;
  config: Destination | null;
};

function newSlotId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `s-${Math.random().toString(36).slice(2, 11)}`;
}

const DEFAULT_FORM = {
  name: '',
  schemaJson: '{\n  "type": "object",\n  "required": ["id", "type", "data"],\n  "properties": {\n    "id":   { "type": "string" },\n    "type": { "type": "string" },\n    "data": { "type": "object" }\n  }\n}',
  slots: [] as DestSlot[],
  healingEnabled: true,
  maxAttempts: 3,
  autoApply: true,
  notifyOnHeal: true,
  notifyOnDead: true,
};

function cloneDestinationsToSlots(destinations: Destination[]): DestSlot[] {
  return destinations.map(d => ({
    id: newSlotId(),
    type: d.type,
    config: JSON.parse(JSON.stringify(d)) as Destination,
  }));
}

function DestArrowSummary({ dest, dict }: { dest: Destination; dict: Dictionary }) {
  const dt = dict.dashboard.flows.destTypes;
  const ell = dict.dashboard.flows.placeholderEllipsis;
  switch (dest.type) {
    case 'supabase':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>{dt.supabase}</span>
          <IconArrowRight size={10} />
          <span>{'tableName' in dest ? dest.tableName : ell}</span>
        </span>
      );
    case 'postgres':
    case 'mysql':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>{dest.type === 'postgres' ? dt.postgres : dt.mysql}</span>
          <IconArrowRight size={10} />
          <span>{dest.table}</span>
        </span>
      );
    case 'webhook':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>{dt.webhook}</span>
          <IconArrowRight size={10} />
          <span>{dest.url?.slice(0, 42) ?? ell}</span>
        </span>
      );
    case 'http_api':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>{dt.http_api}</span>
          <IconArrowRight size={10} />
          <span>{dest.url?.slice(0, 42) ?? ell}</span>
        </span>
      );
    case 'bigquery':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>{dt.bigquery}</span>
          <IconArrowRight size={10} />
          <span>
            {dest.datasetId}.{dest.tableId}
          </span>
        </span>
      );
    default:
      return <span>{(dest as { type: string }).type}</span>;
  }
}

function EndpointDestSummary({ ep, dict }: { ep: Endpoint; dict: Dictionary }) {
  const f = dict.dashboard.flows;
  const d = ep.destinations;
  if (!d || d.length === 0) return <>{f.noDestination}</>;
  if (d.length > 1) return <>{f.multiDestinations.replace('{n}', String(d.length))}</>;
  return <DestArrowSummary dest={d[0]!} dict={dict} />;
}

export default function FlowsPage() {
  const { dict } = useI18n();
  const flows = dict.dashboard.flows;
  const ui = dict.dashboard.ui;
  const modalSteps = useMemo(
    () =>
      [
        { id: 'basic' as const, label: flows.stepBasic },
        { id: 'dest' as const, label: flows.stepDest },
        { id: 'heal' as const, label: flows.stepHeal },
      ] as const,
    [flows.stepBasic, flows.stepDest, flows.stepHeal]
  );
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEndpointId, setEditingEndpointId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pauseError, setPauseError] = useState('');
  const [statusToggleId, setStatusToggleId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openModal() {
    setError('');
    setModalStep(0);
    setEditingEndpointId(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  }

  function openEditModal(ep: Endpoint) {
    setError('');
    setModalStep(0);
    setEditingEndpointId(ep.id);
    const schemaJson = JSON.stringify(ep.schema ?? {}, null, 2);
    const slots =
      ep.destinations && ep.destinations.length > 0
        ? cloneDestinationsToSlots(ep.destinations)
        : [];
    setForm({
      name: ep.name,
      schemaJson,
      slots,
      healingEnabled: ep.healingConfig.enabled,
      maxAttempts: Math.min(20, Math.max(1, ep.healingConfig.maxAttempts || 3)),
      autoApply: ep.healingConfig.autoApplyRules,
      notifyOnHeal: ep.healingConfig.notifyOnHealing,
      notifyOnDead: ep.healingConfig.notifyOnDead,
    });
    setShowModal(true);
  }

  function validateSchemaJson(): string | null {
    try {
      const parsed: unknown = JSON.parse(form.schemaJson);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return flows.errSchemaObject;
      }
    } catch {
      return flows.errSchemaInvalid;
    }
    return null;
  }

  function validateDestinationsStep(): string | null {
    if (form.slots.length === 0) return flows.errAddDestination;
    for (const s of form.slots) {
      if (!s.type) return flows.errPickType;
      if (!s.config) return flows.errCompleteConfig;
      if ((s.config as { type: string }).type !== s.type) {
        return flows.errSlotMismatch;
      }
      const err = validateDestinationRequiredFields(s.type, s.config, dict);
      if (err) return err;
    }
    return null;
  }

  function goNextStep() {
    setError('');
    if (modalStep === 0) {
      if (!form.name.trim()) {
        setError(flows.errNameRequired);
        return;
      }
      const schemaErr = validateSchemaJson();
      if (schemaErr) {
        setError(schemaErr);
        return;
      }
      setModalStep(1);
      return;
    }
    if (modalStep === 1) {
      const destErr = validateDestinationsStep();
      if (destErr) {
        setError(destErr);
        return;
      }
      setModalStep(2);
    }
  }

  function goPrevStep() {
    setError('');
    setModalStep(s => Math.max(0, s - 1));
  }

  const load = useCallback(async () => {
    setPauseError('');
    const eps = await listEndpoints();
    setEndpoints(eps);
    const counts: Record<string, number> = {};
    await Promise.all(eps.map(async ep => {
      const r = await listEvents(ep.id, { limit: 1 });
      counts[ep.id] = r.total;
    }));
    setEventCounts(counts);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showModal]);

  function addSlot() {
    setForm(f => ({
      ...f,
      slots: [...f.slots, { id: newSlotId(), type: null, config: null }],
    }));
  }

  function setSlotType(slotId: string, t: DestinationType) {
    setForm(f => ({
      ...f,
      slots: f.slots.map(s =>
        s.id === slotId ? { ...s, type: t, config: createEmptyDestination(t) } : s
      ),
    }));
  }

  function setSlotConfig(slotId: string, config: Destination) {
    setForm(f => ({
      ...f,
      slots: f.slots.map(s => (s.id === slotId ? { ...s, config } : s)),
    }));
  }

  function removeSlot(slotId: string) {
    setForm(f => ({ ...f, slots: f.slots.filter(s => s.id !== slotId) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    let schema: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(form.schemaJson);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError(flows.errSchemaObject);
        setSaving(false);
        return;
      }
      schema = parsed as Record<string, unknown>;
    } catch {
      setError(flows.errSchemaInvalid);
      setSaving(false);
      return;
    }

    const destinations: Destination[] = [];
    for (const s of form.slots) {
      if (!s.type) {
        setError(flows.errPickType);
        setSaving(false);
        return;
      }
      if (!s.config) {
        setError(flows.errCompleteConfig);
        setSaving(false);
        return;
      }
      if ((s.config as { type: string }).type !== s.type) {
        setError(flows.errSlotMismatch);
        setSaving(false);
        return;
      }
      const vErr = validateDestinationRequiredFields(s.type, s.config, dict);
      if (vErr) {
        setError(vErr);
        setSaving(false);
        return;
      }
      destinations.push(s.config);
    }

    if (destinations.length === 0) {
      setError(flows.errAddDestination);
      setSaving(false);
      return;
    }

    const healingConfig = {
      enabled: form.healingEnabled,
      maxAttempts: Math.min(20, Math.max(1, Math.floor(form.maxAttempts) || 3)),
      autoApplyRules: form.autoApply,
      notifyOnHealing: form.notifyOnHeal,
      notifyOnDead: form.notifyOnDead,
    };

    if (editingEndpointId) {
      const res = await updateEndpoint(editingEndpointId, {
        name: form.name.trim(),
        schema,
        destinations,
        healingConfig,
      });
      if (res.error) {
        setError(typeof res.error === 'string' ? res.error : flows.errSave);
      } else {
        setShowModal(false);
        setModalStep(0);
        setEditingEndpointId(null);
        setForm(DEFAULT_FORM);
        void load();
      }
    } else {
      const res = await createEndpoint({
        name: form.name,
        schema,
        ...(destinations.length === 1
          ? { destination: destinations[0]! }
          : { destinations }),
        healingConfig,
      });

      if (res.error) {
        setError(typeof res.error === 'string' ? res.error : flows.errCreate);
      } else {
        setShowModal(false);
        setModalStep(0);
        setForm(DEFAULT_FORM);
        void load();
      }
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(flows.confirmDeleteEndpoint)) return;
    setDeletingId(id);
    try {
      await deleteEndpoint(id);
      void load();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTogglePause(ep: Endpoint) {
    setPauseError('');
    const next = ep.status === 'active' ? 'paused' : 'active';
    setStatusToggleId(ep.id);
    const res = await updateEndpoint(ep.id, { status: next });
    setStatusToggleId(null);
    if (res.error) {
      setPauseError(typeof res.error === 'string' ? res.error : flows.errStatusUpdate);
      return;
    }
    void load();
  }

  function closeModal() {
    setShowModal(false);
    setModalStep(0);
    setEditingEndpointId(null);
    setForm(DEFAULT_FORM);
    setError('');
  }

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{flows.title}</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
              {flows.subtitle}
            </div>
          </div>
          <button className="btn-primary" onClick={openModal}>{flows.newEndpoint}</button>
        </div>

        {pauseError && (
          <div
            style={{
              marginBottom: '12px',
              padding: '8px 10px',
              borderRadius: '6px',
              background: 'rgba(239,68,68,.08)',
              border: '1px solid rgba(239,68,68,.2)',
              fontSize: '11px',
              color: 'var(--red)',
            }}
          >
            {pauseError}
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '11px' }}>{dict.dashboard.loading.default}</div>}

        {!loading && endpoints.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⬡</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '6px' }}>{flows.emptyTitle}</div>
            <div style={{ fontSize: '11px' }}>{flows.emptyHint}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {endpoints.map(ep => {
            const webhookUrl = `${getPublicWorkerUrl()}/webhook/${ep.tenant_id}/${ep.slug}`;
            const status = ep.status ?? 'active';
            const statusPill =
              status === 'active' ? (
                <span className="pill pill-active">{flows.statusLive}</span>
              ) : status === 'paused' ? (
                <span className="pill pill-inactive">{flows.statusPaused}</span>
              ) : (
                <span className="pill pill-dead">{flows.statusError}</span>
              );
            const toggling = statusToggleId === ep.id;
            return (
              <div key={ep.id} style={{
                background: 'var(--bg2)', border: '1px solid var(--border2)',
                borderRadius: '8px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {statusPill}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{ep.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      POST {webhookUrl}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      {flows.eventsCount.replace(
                        '{n}',
                        eventCounts[ep.id] != null ? String(eventCounts[ep.id]) : ui.emDash
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: 'var(--muted)',
                        marginTop: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '4px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {ep.destinations && ep.destinations.length > 0 ? (
                        <>
                          <IconArrowRight size={10} style={{ color: 'var(--border2)' }} />
                          <EndpointDestSummary ep={ep} dict={dict} />
                        </>
                      ) : (
                        <span>{flows.noDestination}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(webhookUrl)}
                    className="btn-ghost"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    {flows.copyUrl}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleTogglePause(ep)}
                    className="btn-ghost"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                    disabled={toggling}
                  >
                    {toggling ? ui.toggleWait : status === 'active' ? flows.pause : flows.resume}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(ep)}
                    className="btn-ghost"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    {flows.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(ep.id)}
                    className="btn-danger"
                    style={{ fontSize: '10px', padding: '4px 8px', opacity: deletingId === ep.id ? 0.65 : 1 }}
                    disabled={deletingId === ep.id}
                  >
                    {deletingId === ep.id ? ui.deleting : flows.delete}
                  </button>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {flows.healingLine} {ep.healingConfig.enabled ? flows.healingOn : flows.healingOff}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {flows.autoApply} {ep.healingConfig.autoApplyRules ? '✓' : '✗'}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {flows.maxRetries} {ep.healingConfig.maxAttempts}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sentinel-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>{flows.tryWebhookTitle}</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
          {flows.tryWebhookHint}
        </div>
        <pre style={{
          background: 'var(--bg2)', borderRadius: '6px', padding: '12px',
          fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text)',
          border: '1px solid var(--border)', overflowX: 'auto',
        }}>
{`curl -X POST \\
  https://sentinel-saas.TUSUBDOMINIO.workers.dev/webhook/TENANT_ID/SLUG \\
  -H "Content-Type: application/json" \\
  -d '{"id":"evt_001","type":"payment.created","data":{"amount_cents":4990}}'`}
        </pre>
      </div>

      <SentinelModal open={showModal} onClose={closeModal} labelledBy="modal-endpoint-title">
        <div
          className="sentinel-card fade-up"
          style={{
            width: 'min(640px, calc(100vw - clamp(24px, 6vw, 48px)))',
            maxWidth: '100%',
            maxHeight: 'min(90dvh, 900px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
          }}
        >
            <div style={{ padding: 'clamp(16px, 3vw, 24px)', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              <div
                id="modal-endpoint-title"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: 700, marginBottom: '12px' }}
              >
                {editingEndpointId ? flows.modalEditTitle : flows.modalNewTitle}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                {modalSteps.map((s, i) => (
                  <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      fontSize: '9px',
                      fontWeight: 700,
                      flexShrink: 0,
                      background: i === modalStep ? 'var(--accent)' : i < modalStep ? 'rgba(34,197,94,.2)' : 'var(--bg2)',
                      color: i === modalStep ? 'var(--bg)' : 'var(--muted)',
                      border: i === modalStep ? 'none' : '1px solid var(--border)',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ color: i === modalStep ? 'var(--text)' : 'var(--muted)', fontWeight: i === modalStep ? 600 : 400 }}>
                      {s.label}
                    </span>
                    {i < modalSteps.length - 1 && (
                      <IconArrowRight size={12} aria-hidden style={{ color: 'var(--border)', marginLeft: '2px' }} />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSave}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
            >
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'clamp(16px, 3vw, 24px)', paddingTop: '16px' }}>
                {modalStep === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>{flows.labelName}</label>
                      <input className="sentinel-input" placeholder={flows.namePlaceholder} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>{flows.labelSchema}</label>
                      <textarea
                        className="sentinel-input"
                        style={{ height: 'clamp(100px, 25vh, 180px)', resize: 'vertical', minHeight: '100px' }}
                        value={form.schemaJson}
                        onChange={e => setForm(f => ({ ...f, schemaJson: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {modalStep === 1 && (
                  <div style={{ background: 'rgba(34,197,94,.05)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(34,197,94,.2)' }}>
                    <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', marginBottom: '10px' }}>
                      {flows.destSectionTitle}
                    </div>

                    {form.slots.length === 0 && (
                      <button type="button" className="btn-ghost" style={{ fontSize: '11px' }} onClick={addSlot}>
                        {flows.addFirstDest}
                      </button>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {form.slots.map((slot, idx) => (
                        <div key={slot.id} style={{ background: 'var(--bg2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                              {flows.destSlot.replace('{n}', String(idx + 1))}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.id)}
                              style={{
                                fontSize: '9px', padding: '4px 8px',
                                background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)',
                                color: 'var(--red)', borderRadius: '4px', cursor: 'pointer',
                              }}
                            >
                              {flows.removeSlot}
                            </button>
                          </div>

                          {!slot.type ? (
                            <DestinationSelector
                              selected={null}
                              onChange={t => setSlotType(slot.id, t)}
                            />
                          ) : (
                            <>
                              <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '9px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>{flows.changeType}</label>
                                <select
                                  className="sentinel-input"
                                  value={slot.type}
                                  onChange={e => setSlotType(slot.id, e.target.value as DestinationType)}
                                  style={{ fontSize: '11px' }}
                                >
                                  {(Object.keys(DESTINATION_CONFIGS) as DestinationType[]).map(k => (
                                    <option key={k} value={k}>{dict.dashboard.destinations.types[k].label}</option>
                                  ))}
                                </select>
                              </div>
                              <DestinationConfigForm
                                key={`${slot.id}-${slot.type}`}
                                type={slot.type}
                                initialValue={slot.config ?? createEmptyDestination(slot.type)}
                                onChange={c => setSlotConfig(slot.id, c)}
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {form.slots.length > 0 && form.slots.length < 5 && (
                      <button
                        type="button"
                        onClick={addSlot}
                        style={{
                          marginTop: '12px', fontSize: '10px', padding: '8px 12px',
                          background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)',
                          borderRadius: '6px', cursor: 'pointer', color: 'var(--accent)', fontWeight: 500,
                        }}
                      >
                        {flows.addAnotherDest}
                      </button>
                    )}
                  </div>
                )}

                {modalStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.healingEnabled}
                        onChange={e => setForm(f => ({ ...f, healingEnabled: e.target.checked }))}
                      />
                      {flows.healingActive}
                    </label>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '4px' }}>
                        {flows.maxAttemptsLabel}
                      </label>
                      <input
                        type="number"
                        className="sentinel-input"
                        min={1}
                        max={20}
                        value={form.maxAttempts}
                        onChange={e => setForm(f => ({ ...f, maxAttempts: Number(e.target.value) }))}
                        style={{ maxWidth: '120px', fontSize: '12px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {[
                        { key: 'autoApply' as const, label: flows.checkAutoApply },
                        { key: 'notifyOnHeal' as const, label: flows.checkNotifyHeal },
                        { key: 'notifyOnDead' as const, label: flows.checkNotifyDead },
                      ].map(({ key, label }) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={form[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: '12px', padding: '8px 10px', borderRadius: '6px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: '11px', color: 'var(--red)' }}>
                    {error}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg)',
              }}>
                <button type="button" className="btn-ghost" onClick={closeModal}>{flows.cancel}</button>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                  {modalStep > 0 && (
                    <button type="button" className="btn-ghost" onClick={goPrevStep} disabled={saving}>
                      {flows.back}
                    </button>
                  )}
                  {modalStep < modalSteps.length - 1 && (
                    <button type="button" className="btn-primary" onClick={goNextStep}>
                      {flows.next}
                    </button>
                  )}
                  {modalStep === modalSteps.length - 1 && (
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? ui.saving : editingEndpointId ? flows.saveEndpoint : flows.createEndpoint}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
      </SentinelModal>
    </div>
  );
}
