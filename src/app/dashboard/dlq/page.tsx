'use client';

import { useCallback, useEffect, useState } from 'react';
import { listDLQ, reinjectDLQEvent, discardDLQEvent } from '@/lib/api';
import type { DLQEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DLQPage() {
  const [events, setEvents] = useState<DLQEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DLQEvent | null>(null);
  const [correctedPayload, setCorrectedPayload] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    const dlq = await listDLQ();
    setEvents(dlq);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  async function handleReinject(ev: DLQEvent, corrected?: Record<string, unknown>) {
    setActionLoading(ev.id);
    const res = await reinjectDLQEvent(ev.id, corrected);
    if (res.error) { showToast('Error: ' + res.error); }
    else { showToast('✦ Evento reinyectado exitosamente'); setSelected(null); void load(); }
    setActionLoading('');
  }

  async function handleDiscard(ev: DLQEvent) {
    if (!confirm('¿Descartar este evento? Esta acción no se puede deshacer.')) return;
    setActionLoading(ev.id);
    await discardDLQEvent(ev.id);
    showToast('Evento descartado');
    setActionLoading('');
    void load();
  }

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
          DEAD LETTER QUEUE
        </div>
        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
          Eventos irrecuperables · Todos los payloads están guardados · Requieren intervención humana
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '11px' }}>Cargando DLQ…</div>}

      {!loading && events.length === 0 && (
        <div className="sentinel-card" style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>✦</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent)', marginBottom: '4px' }}>
            DLQ limpia
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            Todos los eventos fueron procesados o reparados exitosamente
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {events.map(ev => (
          <div key={ev.id} className="sentinel-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 6px',
                borderRadius: '3px', background: 'rgba(239,68,68,.1)', color: 'var(--red)',
                border: '1px solid rgba(239,68,68,.2)', fontWeight: 700,
              }}>ERROR</span>
              <div style={{ flex: 1, fontSize: '12px', fontWeight: 500 }}>
                {ev.error_reason || 'Payload con estructura desconocida'}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                #{ev.event_id?.slice(0, 8)}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>
                {formatDistanceToNow(new Date(ev.created_at), { addSuffix: true, locale: es })}
              </div>
            </div>

            <pre style={{
              background: 'var(--bg2)', borderRadius: '6px', padding: '10px',
              fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)',
              lineHeight: '1.6', border: '1px solid var(--border)', maxHeight: '80px',
              overflow: 'hidden', whiteSpace: 'pre-wrap',
            }}>
              {JSON.stringify(ev.payload, null, 2)}
            </pre>

            <div style={{ fontSize: '10px', color: 'var(--muted)', margin: '8px 0' }}>
              {ev.attempts} intentos de reparación · IA no pudo corregir con suficiente confianza · Payload guardado completo
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => { setSelected(ev); setCorrectedPayload(JSON.stringify(ev.payload, null, 2)); }}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', background: 'rgba(59,130,246,.1)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,.3)', fontWeight: 700 }}
              >
                ✎ Corregir y reinyectar
              </button>
              <button
                onClick={() => handleReinject(ev)}
                disabled={actionLoading === ev.id}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', background: 'rgba(200,245,80,.1)', color: 'var(--accent)', border: '1px solid rgba(200,245,80,.3)', fontWeight: 700 }}
              >
                ▶ Reinyectar tal cual
              </button>
              <button
                onClick={() => handleDiscard(ev)}
                disabled={actionLoading === ev.id}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', background: 'rgba(239,68,68,.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.2)', fontWeight: 700 }}
              >
                ✕ Descartar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Correction modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="sentinel-card fade-up" style={{ width: '580px', maxWidth: '100%', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>
              ✎ CORREGIR PAYLOAD
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>
              Editá el JSON del evento y reinyectalo al flujo para que sea procesado de nuevo:
            </div>
            <textarea
              className="sentinel-input"
              style={{ height: '200px', resize: 'vertical', marginBottom: '12px' }}
              value={correctedPayload}
              onChange={e => setCorrectedPayload(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setSelected(null)}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(correctedPayload);
                    handleReinject(selected, parsed);
                  } catch {
                    showToast('JSON inválido');
                  }
                }}
              >
                ▶ Reinyectar corregido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px',
          background: 'var(--card)', border: '1px solid var(--accent)',
          borderRadius: '8px', padding: '10px 16px', fontSize: '11px',
          fontFamily: 'var(--font-mono)', color: 'var(--accent)',
          zIndex: 200, display: 'flex', alignItems: 'center', gap: '8px',
        }} className="slide-in">
          ✦ {toast}
        </div>
      )}
    </div>
  );
}
