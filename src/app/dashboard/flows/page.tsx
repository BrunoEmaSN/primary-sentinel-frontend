'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getPublicWorkerUrl,
  listEndpoints,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  listEvents,
} from '@/lib/api';
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

const MODAL_STEPS = [
  { id: 'basic', label: 'Básico' },
  { id: 'dest', label: 'Destinos' },
  { id: 'heal', label: 'Healing' },
] as const;

function DestArrowSummary({ dest }: { dest: Destination }) {
  switch (dest.type) {
    case 'supabase':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>Supabase</span>
          <IconArrowRight size={10} />
          <span>{'tableName' in dest ? dest.tableName : '…'}</span>
        </span>
      );
    case 'postgres':
    case 'mysql':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>{dest.type.toUpperCase()}</span>
          <IconArrowRight size={10} />
          <span>{dest.table}</span>
        </span>
      );
    case 'webhook':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>Webhook</span>
          <IconArrowRight size={10} />
          <span>{dest.url?.slice(0, 42) ?? '…'}</span>
        </span>
      );
    case 'http_api':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>HTTP API</span>
          <IconArrowRight size={10} />
          <span>{dest.url?.slice(0, 42) ?? '…'}</span>
        </span>
      );
    case 'bigquery':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span>BigQuery</span>
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

function EndpointDestSummary({ ep }: { ep: Endpoint }) {
  const d = ep.destinations;
  if (!d || d.length === 0) return <>Sin destino</>;
  if (d.length > 1) return <>{d.length} destinos (fan-out)</>;
  return <DestArrowSummary dest={d[0]!} />;
}

export default function FlowsPage() {
  const { dict } = useI18n();
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
        return 'El schema debe ser un objeto JSON';
      }
    } catch {
      return 'JSON de schema inválido';
    }
    return null;
  }

  function validateDestinationsStep(): string | null {
    if (form.slots.length === 0) return 'Agregá al menos un destino';
    for (const s of form.slots) {
      if (!s.type) return 'Elegí el tipo para cada destino';
      if (!s.config) return 'Completá la configuración de cada destino';
      if ((s.config as { type: string }).type !== s.type) {
        return 'Destino inconsistente; reconfigurá el slot';
      }
      const err = validateDestinationRequiredFields(s.type, s.config);
      if (err) return err;
    }
    return null;
  }

  function goNextStep() {
    setError('');
    if (modalStep === 0) {
      if (!form.name.trim()) {
        setError('El nombre es obligatorio');
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
        setError('El schema debe ser un objeto JSON');
        setSaving(false);
        return;
      }
      schema = parsed as Record<string, unknown>;
    } catch {
      setError('JSON de schema inválido');
      setSaving(false);
      return;
    }

    const destinations: Destination[] = [];
    for (const s of form.slots) {
      if (!s.type) {
        setError('Elegí el tipo para cada destino');
        setSaving(false);
        return;
      }
      if (!s.config) {
        setError('Completá la configuración de cada destino');
        setSaving(false);
        return;
      }
      if ((s.config as { type: string }).type !== s.type) {
        setError('Destino inconsistente; reconfigurá el slot');
        setSaving(false);
        return;
      }
      const vErr = validateDestinationRequiredFields(s.type, s.config);
      if (vErr) {
        setError(vErr);
        setSaving(false);
        return;
      }
      destinations.push(s.config);
    }

    if (destinations.length === 0) {
      setError('Agregá al menos un destino');
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
        setError(typeof res.error === 'string' ? res.error : 'Error al guardar');
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
        setError(typeof res.error === 'string' ? res.error : 'Error al crear');
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
    if (!confirm('¿Eliminar este endpoint?')) return;
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
      setPauseError(typeof res.error === 'string' ? res.error : 'No se pudo actualizar el estado');
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>ENDPOINTS CONFIGURADOS</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
              Multi-destino: cada fila puede ser un tipo distinto (Supabase, webhook, SQL, BigQuery…).
            </div>
          </div>
          <button className="btn-primary" onClick={openModal}>+ Nuevo endpoint</button>
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '6px' }}>Sin endpoints aún</div>
            <div style={{ fontSize: '11px' }}>Creá tu primer endpoint para empezar a recibir webhooks</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {endpoints.map(ep => {
            const webhookUrl = `${getPublicWorkerUrl()}/webhook/${ep.tenant_id}/${ep.slug}`;
            const status = ep.status ?? 'active';
            const statusPill =
              status === 'active' ? (
                <span className="pill pill-active">LIVE</span>
              ) : status === 'paused' ? (
                <span className="pill pill-inactive">PAUSA</span>
              ) : (
                <span className="pill pill-dead">ERROR</span>
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
                      {eventCounts[ep.id] ?? '—'} eventos
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
                          <EndpointDestSummary ep={ep} />
                        </>
                      ) : (
                        <span>Sin destino</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(webhookUrl)}
                    className="btn-ghost"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleTogglePause(ep)}
                    className="btn-ghost"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                    disabled={toggling}
                  >
                    {toggling ? '…' : status === 'active' ? 'Pausar' : 'Reanudar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(ep)}
                    className="btn-ghost"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(ep.id)}
                    className="btn-danger"
                    style={{ fontSize: '10px', padding: '4px 8px', opacity: deletingId === ep.id ? 0.65 : 1 }}
                    disabled={deletingId === ep.id}
                  >
                    {deletingId === ep.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    Healing: {ep.healingConfig.enabled ? '✓ activo' : '✗ inactivo'}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    Auto-apply: {ep.healingConfig.autoApplyRules ? '✓' : '✗'}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    Max reintentos: {ep.healingConfig.maxAttempts}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sentinel-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>PROBAR UN WEBHOOK</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
          Enviá un POST a tu endpoint para ver Primary Sentinel en acción:
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
                {editingEndpointId ? 'EDITAR ENDPOINT' : '+ NUEVO ENDPOINT'}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                {MODAL_STEPS.map((s, i) => (
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
                    {i < MODAL_STEPS.length - 1 && (
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
                      <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>NOMBRE</label>
                      <input className="sentinel-input" placeholder="ej: Stripe Webhooks" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>SCHEMA JSON (Zod-compatible)</label>
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
                      DESTINOS (fan-out paralelo, hasta 5)
                    </div>

                    {form.slots.length === 0 && (
                      <button type="button" className="btn-ghost" style={{ fontSize: '11px' }} onClick={addSlot}>
                        + Agregar primer destino
                      </button>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {form.slots.map((slot, idx) => (
                        <div key={slot.id} style={{ background: 'var(--bg2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                              Destino #{idx + 1}
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
                              Quitar
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
                                <label style={{ fontSize: '9px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Cambiar tipo</label>
                                <select
                                  className="sentinel-input"
                                  value={slot.type}
                                  onChange={e => setSlotType(slot.id, e.target.value as DestinationType)}
                                  style={{ fontSize: '11px' }}
                                >
                                  {(Object.keys(DESTINATION_CONFIGS) as DestinationType[]).map(k => (
                                    <option key={k} value={k}>{DESTINATION_CONFIGS[k].label}</option>
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
                        + Agregar otro destino
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
                      Healing activo
                    </label>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '4px' }}>
                        MÁX. REINTENTOS
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
                        { key: 'autoApply' as const, label: 'Auto-aplicar reglas IA' },
                        { key: 'notifyOnHeal' as const, label: 'Notificar reparaciones' },
                        { key: 'notifyOnDead' as const, label: 'Notificar DLQ' },
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
                <button type="button" className="btn-ghost" onClick={closeModal}>Cancelar</button>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                  {modalStep > 0 && (
                    <button type="button" className="btn-ghost" onClick={goPrevStep} disabled={saving}>
                      Atrás
                    </button>
                  )}
                  {modalStep < MODAL_STEPS.length - 1 && (
                    <button type="button" className="btn-primary" onClick={goNextStep}>
                      Siguiente
                    </button>
                  )}
                  {modalStep === MODAL_STEPS.length - 1 && (
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'Guardando…' : editingEndpointId ? 'Guardar cambios' : 'Crear endpoint'}
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
