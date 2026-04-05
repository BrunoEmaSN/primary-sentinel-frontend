'use client';

import { useCallback, useEffect, useState } from 'react';
import { listEndpoints, createEndpoint, deleteEndpoint, listEvents } from '@/lib/api';
import type { Endpoint } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

const DEFAULT_FORM = {
  name: '',
  schemaJson: '{\n  "type": "object",\n  "required": ["id", "type", "data"],\n  "properties": {\n    "id":   { "type": "string" },\n    "type": { "type": "string" },\n    "data": { "type": "object" }\n  }\n}',
  tableName: '',
  autoApply: true,
  notifyOnHeal: true,
  notifyOnDead: true,
};

export default function FlowsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const eps = await listEndpoints();
    setEndpoints(eps);
    // fetch event counts per endpoint
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    let schema: object;
    try { schema = JSON.parse(form.schemaJson); }
    catch { setError('JSON de schema inválido'); setSaving(false); return; }

    const res = await createEndpoint({
      name: form.name,
      schema,
      destination: { type: 'supabase', tableName: form.tableName },
      healingConfig: {
        enabled: true,
        maxAttempts: 3,
        autoApplyRules: form.autoApply,
        notifyOnHealing: form.notifyOnHeal,
        notifyOnDead: form.notifyOnDead,
      },
    });

    if (res.error) { setError(res.error); }
    else { setShowModal(false); setForm(DEFAULT_FORM); void load(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este endpoint?')) return;
    await deleteEndpoint(id);
    void load();
  }

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>ENDPOINTS CONFIGURADOS</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
              Cada endpoint es un webhook que Sentinel monitorea y auto-repara
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nuevo endpoint</button>
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
                      → {ep.destination.tableName || ep.destination.type}
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

      {/* Webhook test instructions */}
      <div className="sentinel-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>PROBAR UN WEBHOOK</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
          Enviá un POST a tu endpoint para ver al Sentinel en acción:
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="sentinel-card fade-up" style={{ width: '500px', maxWidth: '100%', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              + NUEVO ENDPOINT
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>NOMBRE</label>
                <input className="sentinel-input" placeholder="ej: Stripe Webhooks" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>TABLA DESTINO (Supabase)</label>
                <input className="sentinel-input" placeholder="ej: stripe_events" value={form.tableName} onChange={e => setForm(f => ({ ...f, tableName: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '4px' }}>SCHEMA JSON (Zod-compatible)</label>
                <textarea
                  className="sentinel-input"
                  style={{ height: '120px', resize: 'vertical' }}
                  value={form.schemaJson}
                  onChange={e => setForm(f => ({ ...f, schemaJson: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
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
              {error && (
                <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: '11px', color: 'var(--red)' }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando…' : 'Crear endpoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
