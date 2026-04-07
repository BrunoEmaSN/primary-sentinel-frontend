'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { listEndpoints, createEndpoint, deleteEndpoint, listEvents } from '@/lib/api';
import type { Endpoint } from '@/types';
import { DESTINATION_CONFIGS, type Destination, type DestinationType } from '@/types/destinations';
import { DestinationSelector } from '@/components/dashboard/DestinationSelector';
import { DestinationConfigForm } from '@/components/dashboard/DestinationConfigForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

/** Por encima de sidebar/topbar y dropdowns (z-index ~100). */
const MODAL_LAYER_Z = 10_000;

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
  autoApply: true,
  notifyOnHeal: true,
  notifyOnDead: true,
};

const MODAL_STEPS = [
  { id: 'basic', label: 'Básico' },
  { id: 'dest', label: 'Destinos' },
  { id: 'heal', label: 'Healing' },
] as const;

function summarizeDestination(dest: Destination): string {
  switch (dest.type) {
    case 'supabase':
      return `Supabase → ${'tableName' in dest ? dest.tableName : '…'}`;
    case 'postgres':
    case 'mysql':
      return `${dest.type.toUpperCase()} → ${dest.table}`;
    case 'webhook':
      return `Webhook → ${dest.url?.slice(0, 42) ?? '…'}`;
    case 'http_api':
      return `HTTP API → ${dest.url?.slice(0, 42) ?? '…'}`;
    case 'bigquery':
      return `BigQuery → ${dest.datasetId}.${dest.tableId}`;
    default:
      return (dest as { type: string }).type;
  }
}

function endpointDestSummary(ep: Endpoint): string {
  const d = ep.destinations;
  if (!d || d.length === 0) return 'Sin destino';
  if (d.length > 1) return `${d.length} destinos (fan-out)`;
  return summarizeDestination(d[0]!);
}

export default function FlowsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function openModal() {
    setError('');
    setModalStep(0);
    setForm(DEFAULT_FORM);
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
      const c = s.config ?? ({ type: s.type } as Destination);
      if ((c as { type: string }).type !== s.type) {
        return 'Destino inconsistente; reconfigurá el slot';
      }
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
        s.id === slotId ? { ...s, type: t, config: { type: t } as Destination } : s
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

  async function handleCreate(e: React.FormEvent) {
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
      const c = s.config ?? ({ type: s.type } as Destination);
      if ((c as { type: string }).type !== s.type) {
        setError('Destino inconsistente; reconfigurá el slot');
        setSaving(false);
        return;
      }
      destinations.push(c);
    }

    if (destinations.length === 0) {
      setError('Agregá al menos un destino');
      setSaving(false);
      return;
    }

    const res = await createEndpoint({
      name: form.name,
      schema,
      ...(destinations.length === 1
        ? { destination: destinations[0]! }
        : { destinations }),
      healingConfig: {
        enabled: true,
        maxAttempts: 3,
        autoApplyRules: form.autoApply,
        notifyOnHealing: form.notifyOnHeal,
        notifyOnDead: form.notifyOnDead,
      },
    });

    if (res.error) {
      setError(typeof res.error === 'string' ? res.error : 'Error al crear');
    } else {
      setShowModal(false);
      setModalStep(0);
      setForm(DEFAULT_FORM);
      void load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este endpoint?')) return;
    await deleteEndpoint(id);
    void load();
  }

  function closeModal() {
    setShowModal(false);
    setModalStep(0);
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

        {loading && <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '11px' }}>Cargando…</div>}

        {!loading && endpoints.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⬡</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '6px' }}>Sin endpoints aún</div>
            <div style={{ fontSize: '11px' }}>Creá tu primer endpoint para empezar a recibir webhooks</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {endpoints.map(ep => {
            const webhookUrl = `${API_URL}/webhook/${ep.tenant_id}/${ep.slug}`;
            return (
              <div key={ep.id} style={{
                background: 'var(--bg2)', border: '1px solid var(--border2)',
                borderRadius: '8px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="pill pill-active">LIVE</span>
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
                    <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '1px' }}>
                      → {endpointDestSummary(ep)}
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
                    onClick={() => handleDelete(ep.id)}
                    className="btn-danger"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    Eliminar
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

      {showModal && createPortal(
        <div
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: MODAL_LAYER_Z,
            minHeight: '100dvh',
            boxSizing: 'border-box',
            padding: 'clamp(12px, 3vw, 24px)',
            paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
            background: 'rgba(0,0,0,.7)',
            display: 'flex',
            alignItems: 'safe center',
            justifyContent: 'center',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="sentinel-card fade-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-endpoint-title"
            style={{
              width: 'min(640px, calc(100vw - clamp(24px, 6vw, 48px)))',
              maxWidth: '100%',
              maxHeight: 'min(90dvh, 900px)',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              margin: 'auto',
              flexShrink: 0,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: 'clamp(16px, 3vw, 24px)', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              <div
                id="modal-endpoint-title"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: 700, marginBottom: '12px' }}
              >
                + NUEVO ENDPOINT
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
                      <span aria-hidden style={{ color: 'var(--border)', marginLeft: '2px' }}>→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleCreate}
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
                                initialValue={slot.config ?? { type: slot.type }}
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
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    {[
                      { key: 'autoApply', label: 'Auto-aplicar reglas IA' },
                      { key: 'notifyOnHeal', label: 'Notificar reparaciones' },
                      { key: 'notifyOnDead', label: 'Notificar DLQ' },
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={form[key as keyof typeof form] as boolean}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                        />
                        {label}
                      </label>
                    ))}
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
                      {saving ? 'Guardando…' : 'Crear endpoint'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
