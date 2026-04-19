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
import { jsonDiffSnapshotVsDlq, type JsonDiffPart } from '@/lib/dlqPayloadDiff';
import type { DLQEvent } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { IconArrowRight } from '@/components/icons/Arrows';
import { useI18n } from '@/lib/i18n/I18nProvider';
import SentinelModal from '@/components/SentinelModal';
import { toast } from 'sonner';

export default function DLQPage() {
  const { dict } = useI18n();
  const [events, setEvents] = useState<DLQEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DLQEvent | null>(null);
  const [correctedPayload, setCorrectedPayload] = useState('');
  const [snapshotName, setSnapshotName] = useState('antes-reintento');
  const [notes, setNotes] = useState<unknown[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [diffModalEvent, setDiffModalEvent] = useState<DLQEvent | null>(null);
  const [diffModalLoading, setDiffModalLoading] = useState(false);
  const [diffModalError, setDiffModalError] = useState('');
  const [diffSnapshots, setDiffSnapshots] = useState<{ id: string; name?: string; created_at?: string }[]>([]);
  const [diffSelectedSnapId, setDiffSelectedSnapId] = useState('');
  const [diffParts, setDiffParts] = useState<JsonDiffPart[]>([]);
  const [diffSameJson, setDiffSameJson] = useState(false);
  const [diffOpeningId, setDiffOpeningId] = useState<string | null>(null);
  const [noteSaving, setNoteSaving] = useState(false);
  const [tagSaving, setTagSaving] = useState(false);

  const load = useCallback(async () => {
    const dlq = await listDLQ();
    setEvents(dlq);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleReinject(ev: DLQEvent, corrected?: Record<string, unknown>) {
    setActionLoading(ev.id);
    const res = await reinjectDLQEvent(ev.id, corrected, {
      snapshotName: snapshotName.trim() || undefined,
    });
    if (res.error) {
      toast.error('Error: ' + res.error);
    } else if (res.data?.status === 'dead') {
      toast.warning(`Reinyección no completó el envío: ${res.data.message ?? 'ver DLQ'}`);
      void load();
    } else {
      toast.success('Evento reinyectado y enviado a destinos');
      setSelected(null);
      void load();
    }
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
    const r = await discardDLQEvent(ev.id);
    setActionLoading('');
    if (r.error) {
      toast.error('Error: ' + r.error);
      return;
    }
    toast.success('Evento descartado');
    void load();
  }

  function closeDiffModal() {
    setDiffModalEvent(null);
    setDiffModalError('');
    setDiffModalLoading(false);
    setDiffSnapshots([]);
    setDiffSelectedSnapId('');
    setDiffParts([]);
    setDiffSameJson(false);
  }

  async function loadDiffForSnapshot(eventId: string, snapshotId: string) {
    setDiffModalLoading(true);
    setDiffModalError('');
    const d = await getDlqDiff(eventId, snapshotId);
    setDiffModalLoading(false);
    if (d.error) {
      setDiffModalError(typeof d.error === 'string' ? d.error : 'Error al cargar el diff');
      setDiffParts([]);
      return;
    }
    if (!d.data) {
      setDiffModalError('Respuesta vacía del servidor');
      setDiffParts([]);
      return;
    }
    setDiffSameJson(d.data.sameJson);
    setDiffParts(jsonDiffSnapshotVsDlq(d.data.left, d.data.right));
  }

  async function openDiffModal(ev: DLQEvent) {
    setDiffOpeningId(ev.id);
    try {
      setDiffModalEvent(ev);
      setDiffModalLoading(true);
      setDiffModalError('');
      setDiffSnapshots([]);
      setDiffSelectedSnapId('');
      setDiffParts([]);
      setDiffSameJson(false);
      const snaps = await listDlqSnapshots(ev.id);
      const body = snaps.data as { data?: unknown[] } | undefined;
      const rawRows = Array.isArray(body?.data) ? body.data : [];
      const normalized = rawRows
        .map((r) => {
          const row = r as Record<string, unknown>;
          return {
            id: String(row.id ?? ''),
            name: typeof row.name === 'string' ? row.name : undefined,
            created_at:
              (typeof row.created_at === 'string' && row.created_at) ||
              (typeof row.createdAt === 'string' && row.createdAt) ||
              undefined,
          };
        })
        .filter((r) => r.id);
      if (normalized.length === 0) {
        setDiffModalLoading(false);
        setDiffModalError(
          'No hay snapshots para este evento. Al reinyectar (con o sin corrección), se puede guardar un snapshot con nombre para comparar después.'
        );
        return;
      }
      setDiffSnapshots(normalized);
      const firstId = normalized[0]!.id;
      setDiffSelectedSnapId(firstId);
      await loadDiffForSnapshot(ev.id, firstId);
    } finally {
      setDiffOpeningId(null);
    }
  }

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
          DEAD LETTER QUEUE
        </div>
        <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.5 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            <span>Flujo:</span>
            <span>webhook</span>
            <IconArrowRight size={10} style={{ color: 'var(--border2)' }} />
            <span>validación</span>
            <IconArrowRight size={10} style={{ color: 'var(--border2)' }} />
            <span>healing opcional</span>
            <IconArrowRight size={10} style={{ color: 'var(--border2)' }} />
            <span>fan-out.</span>
          </div>
          <p style={{ margin: 0 }}>
            Si todo falla, estado <code>dead</code>, copia en R2 bajo{' '}
            <code>dlq/&#123;tenant&#125;/&#123;event&#125;.json</code> y alertas multi-canal según ajustes. Reinyección crea un
            evento nuevo y elimina este registro muerto.
          </p>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '11px' }}>{dict.dashboard.loading.dlq}</div>}

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
                type="button"
                onClick={() => void openDiffModal(ev)}
                disabled={diffOpeningId === ev.id}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: diffOpeningId === ev.id ? 'default' : 'pointer', background: 'rgba(148,163,184,.1)', color: 'var(--muted)', border: '1px solid rgba(148,163,184,.25)', fontWeight: 700, opacity: diffOpeningId === ev.id ? 0.65 : 1 }}
              >
                {diffOpeningId === ev.id ? 'Cargando…' : 'Ver diff snapshot ↔ DLQ'}
              </button>
              <button
                onClick={() => { setSelected(ev); setCorrectedPayload(JSON.stringify(ev.payload, null, 2)); }}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer', background: 'rgba(59,130,246,.1)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,.3)', fontWeight: 700 }}
              >
                ✎ Corregir y reinyectar
              </button>
              <button
                onClick={() => void handleReinject(ev)}
                disabled={actionLoading === ev.id}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: actionLoading === ev.id ? 'default' : 'pointer', background: 'rgba(200,245,80,.1)', color: 'var(--accent)', border: '1px solid rgba(200,245,80,.3)', fontWeight: 700, opacity: actionLoading === ev.id ? 0.65 : 1 }}
              >
                {actionLoading === ev.id ? 'Enviando…' : '▶ Reinyectar tal cual'}
              </button>
              <button
                onClick={() => void handleDiscard(ev)}
                disabled={actionLoading === ev.id}
                style={{ padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: actionLoading === ev.id ? 'default' : 'pointer', background: 'rgba(239,68,68,.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.2)', fontWeight: 700, opacity: actionLoading === ev.id ? 0.65 : 1 }}
              >
                {actionLoading === ev.id ? 'Procesando…' : '✕ Descartar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <SentinelModal
        open={!!diffModalEvent}
        onClose={closeDiffModal}
        labelledBy="dlq-diff-title"
      >
        {diffModalEvent && (
          <div
            className="sentinel-card fade-up"
            style={{
              width: 'min(920px, calc(100vw - clamp(24px, 6vw, 48px)))',
              maxWidth: '100%',
              maxHeight: 'min(88dvh, 900px)',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'clamp(16px, 3vw, 22px)',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
              }}
            >
              <div
                id="dlq-diff-title"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}
              >
                DIFF: SNAPSHOT ↔ PAYLOAD EN DLQ
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.55 }}>
                <code>GET /api/dlq/{'{eventId}'}/diff</code>: compara el JSON del <strong>snapshot</strong> (referencia
                guardada) con el <strong>payload actual</strong> del evento en DLQ (<code>rawPayload</code>). Leyenda
                del diff JSON:{' '}
                <span style={{ background: 'rgba(239,68,68,.15)', padding: '1px 5px', borderRadius: '3px' }}>
                  rojo
                </span>{' '}
                = contenido que figuraba en el snapshot y ya no coincide o falta en el DLQ;{' '}
                <span style={{ background: 'rgba(34,197,94,.15)', padding: '1px 5px', borderRadius: '3px' }}>
                  verde
                </span>{' '}
                = contenido presente en el DLQ y distinto o ausente en el snapshot.
              </div>
            </div>

            <div style={{ flexShrink: 0, padding: '10px clamp(16px, 3vw, 22px)', borderBottom: '1px solid var(--border)' }}>
              {diffSnapshots.length > 1 ? (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px', color: 'var(--muted)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>SNAPSHOT</span>
                  <select
                    className="sentinel-input"
                    style={{ fontSize: '11px' }}
                    value={diffSelectedSnapId}
                    onChange={e => {
                      const id = e.target.value;
                      setDiffSelectedSnapId(id);
                      void loadDiffForSnapshot(diffModalEvent.id, id);
                    }}
                  >
                    {diffSnapshots.map(s => (
                      <option key={s.id} value={s.id}>
                        {(s.name || 'sin nombre') + (s.created_at ? ` · ${s.created_at}` : '')}
                      </option>
                    ))}
                  </select>
                </label>
              ) : diffSnapshots.length === 1 ? (
                <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  Snapshot: {diffSnapshots[0]!.name || '—'} {diffSnapshots[0]!.created_at ? `· ${diffSnapshots[0]!.created_at}` : ''}
                </div>
              ) : null}
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'clamp(12px, 2vw, 18px) clamp(16px, 3vw, 22px)' }}>
              {diffModalLoading && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: '11px' }}>
                  Cargando diff…
                </div>
              )}
              {!diffModalLoading && diffModalError && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: 'rgba(239,68,68,.08)',
                    border: '1px solid rgba(239,68,68,.2)',
                    fontSize: '11px',
                    color: 'var(--red)',
                    lineHeight: 1.5,
                  }}
                >
                  {diffModalError}
                </div>
              )}
              {!diffModalLoading && !diffModalError && diffSameJson && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    background: 'rgba(34,197,94,.06)',
                    border: '1px solid rgba(34,197,94,.2)',
                    fontSize: '11px',
                    color: 'var(--accent)',
                    marginBottom: '12px',
                  }}
                >
                  Los JSON son equivalentes (misma estructura y valores tras normalizar claves).
                </div>
              )}
              {!diffModalLoading && !diffModalError && diffParts.length > 0 && (
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    lineHeight: 1.55,
                    color: 'var(--text)',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  {diffParts.map((part, i) => {
                    const bg = part.added
                      ? 'rgba(34,197,94,.18)'
                      : part.removed
                        ? 'rgba(239,68,68,.16)'
                        : 'transparent';
                    const fg = part.added ? 'var(--accent)' : part.removed ? 'var(--red)' : 'var(--muted)';
                    return (
                      <span key={i} style={{ background: bg, color: fg }}>
                        {part.value}
                      </span>
                    );
                  })}
                </pre>
              )}
            </div>

            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 22px)',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
              <button type="button" className="btn-ghost" onClick={closeDiffModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </SentinelModal>

      <SentinelModal
        open={!!selected}
        onClose={() => setSelected(null)}
        labelledBy="dlq-correct-title"
      >
        {selected && (
          <div
            className="sentinel-card fade-up"
            style={{
              width: 'min(580px, calc(100vw - clamp(24px, 6vw, 48px)))',
              maxWidth: '100%',
              maxHeight: 'min(90dvh, 900px)',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
              }}
            >
              <div
                id="dlq-correct-title"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}
              >
                ✎ CORREGIR PAYLOAD
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Opcional: nombre del snapshot antes de reintentar (auditoría). Editá el JSON y reinyectá al flujo:
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'clamp(16px, 3vw, 24px)', paddingTop: '16px' }}>
              <input
                className="sentinel-input"
                style={{ marginBottom: '10px', width: '100%' }}
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="Nombre del snapshot"
              />
              <textarea
                className="sentinel-input"
                style={{ height: 'clamp(140px, 28vh, 220px)', resize: 'vertical', minHeight: '120px', marginBottom: '16px' }}
                value={correctedPayload}
                onChange={e => setCorrectedPayload(e.target.value)}
              />
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>Notas del equipo</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', maxHeight: '120px', overflow: 'auto' }}>
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
                    disabled={noteSaving}
                    onClick={async () => {
                      if (!selected || !newNote.trim()) return;
                      setNoteSaving(true);
                      try {
                        const r = await addEventNote(selected.id, newNote.trim());
                        if (r.error) {
                          toast.error('Error: ' + r.error);
                          return;
                        }
                        setNewNote('');
                        void loadNotes(selected.id);
                        toast.success('Nota guardada');
                      } finally {
                        setNoteSaving(false);
                      }
                    }}
                  >
                    {noteSaving ? '…' : 'Añadir'}
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
                    disabled={tagSaving}
                    onClick={async () => {
                      if (!selected || !newTag.trim()) return;
                      setTagSaving(true);
                      try {
                        const r = await addEventTag(selected.id, newTag.trim());
                        if (r.error) {
                          toast.error('Error: ' + r.error);
                          return;
                        }
                        setNewTag('');
                        toast.success('Etiqueta guardada');
                      } finally {
                        setTagSaving(false);
                      }
                    }}
                  >
                    {tagSaving ? '…' : 'Tag'}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg)',
                flexShrink: 0,
              }}
            >
              <button type="button" className="btn-ghost" onClick={() => setSelected(null)}>Cancelar</button>
              <button
                type="button"
                className="btn-primary"
                disabled={actionLoading === selected.id}
                onClick={() => {
                  try {
                    const parsed = JSON.parse(correctedPayload);
                    void handleReinject(selected, parsed);
                  } catch {
                    toast.error('JSON inválido');
                  }
                }}
              >
                {actionLoading === selected.id ? 'Enviando…' : '▶ Reinyectar corregido'}
              </button>
            </div>
          </div>
        )}
      </SentinelModal>

    </div>
  );
}
