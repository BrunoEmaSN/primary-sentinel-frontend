'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  listDLQ,
  reinjectDLQEvent,
  discardDLQEvent,
  listEventNotes,
  addEventNote,
  addEventTag,
  getDlqDiff,
  listDlqSnapshots,
} from '@/lib/api';
import type { DLQEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DLQPage() {
  const [events, setEvents] = useState<DLQEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DLQEvent | null>(null);
  const [correctedPayload, setCorrectedPayload] = useState('');
  const [snapshotName, setSnapshotName] = useState('antes-reintento');
  const [notes, setNotes] = useState<unknown[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');
  const [diffText, setDiffText] = useState('');
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
    const res = await reinjectDLQEvent(ev.id, corrected, {
      snapshotName: snapshotName.trim() || undefined,
    });
    if (res.error) { showToast('Error: ' + res.error); }
    else { showToast('✦ Evento reinyectado exitosamente'); setSelected(null); void load(); }
    setActionLoading('');
  }

  async function loadNotes(eventId: string) {
    const r = await listEventNotes(eventId);
    if (r.data?.data) setNotes(r.data.data);
    else setNotes([]);
  }

  useEffect(() => {
    if (selected) void loadNotes(selected.id);
  }, [selected]);

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
        <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.5 }}>
          Flujo: webhook → validación → healing opcional → fan-out. Si todo falla, estado <code>dead</code>, copia en R2
          bajo <code>dlq/&#123;tenant&#125;/&#123;event&#125;.json</code> y alertas multi-canal según ajustes.
          Reinyección crea un evento nuevo y elimina este registro muerto.
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                onClick={async () => {
                  const snaps = await listDlqSnapshots(ev.id);
                  const root = snaps.data as { data?: { id?: string }[] } | undefined;
                  const rows = root?.data;
                  const last = Array.isArray(rows) ? rows[0] : undefined;
                  if (last?.id) {
                    const d = await getDlqDiff(ev.id, last.id);
                    if (d.data) {
                      setDiffText(
                        d.data.sameJson
                          ? 'Sin cambios vs último snapshot'
                          : `Snapshot vs actual: mismo JSON=${String(d.data.sameJson)}`
                      );
                    }
                  } else setDiffText('Sin snapshots aún — guardá uno al reinyectar con nombre.');
                }}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', background: 'rgba(148,163,184,.1)', color: 'var(--muted)', border: '1px solid rgba(148,163,184,.25)', fontWeight: 700 }}
              >
                Diff último snapshot
              </button>
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
            {diffText && (
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>{diffText}</div>
            )}
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
              Opcional: nombre del snapshot antes de reintentar (auditoría). Editá el JSON y reinyectá al flujo:
            </div>
            <input
              className="sentinel-input"
              style={{ marginBottom: '10px', width: '100%' }}
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Nombre del snapshot"
            />
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
            <div style={{ marginTop: '18px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>Notas del equipo</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', maxHeight: '100px', overflow: 'auto' }}>
                {notes.length === 0 ? 'Sin notas.' : notes.map((n, i) => (
                  <div key={i} style={{ marginBottom: '6px' }}>
                    {(n as { body?: string }).body}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <input
                  className="sentinel-input"
                  style={{ flex: 1 }}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Añadir nota…"
                />
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    if (!selected || !newNote.trim()) return;
                    await addEventNote(selected.id, newNote.trim());
                    setNewNote('');
                    void loadNotes(selected.id);
                  }}
                >
                  Añadir
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <input
                  className="sentinel-input"
                  style={{ flex: 1 }}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Etiqueta (ej. cola_muerta)"
                />
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    if (!selected || !newTag.trim()) return;
                    await addEventTag(selected.id, newTag.trim());
                    setNewTag('');
                    showToast('Etiqueta guardada');
                  }}
                >
                  Tag
                </button>
              </div>
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
