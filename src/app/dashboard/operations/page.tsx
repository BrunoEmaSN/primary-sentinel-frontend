'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getDependencyGraph,
  getAiHistory,
  getPipelineMetrics,
  getHeuristicSuggestions,
} from '@/lib/api';

export default function OperationsPage() {
  const [graph, setGraph] = useState<{ nodes: unknown[]; edges: { from: string; to: string; label: string }[] } | null>(
    null
  );
  const [aiLog, setAiLog] = useState<unknown[]>([]);
  const [metrics, setMetrics] = useState<unknown[]>([]);
  const [suggestions, setSuggestions] = useState<{ id: string; text: string; severity: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [g, ai, pm, sug] = await Promise.all([
      getDependencyGraph(),
      getAiHistory(30),
      getPipelineMetrics(48),
      getHeuristicSuggestions(),
    ]);
    if (g.data) setGraph(g.data);
    if (ai.data?.data) setAiLog(ai.data.data);
    if (pm.data?.data) setMetrics(pm.data.data);
    if (sug.data?.suggestions) setSuggestions(sug.data.suggestions);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>OPERACIONES</div>
        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
          Mapa de dependencias, historial de decisiones IA y métricas por etapa (Worker → Supabase).
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)', fontSize: '11px' }}>Cargando…</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="sentinel-card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
            MAPA endpoint → destinos
          </div>
          {!graph?.nodes?.length && !loading ? (
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Sin endpoints todavía.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: 'var(--text)', lineHeight: 1.6 }}>
              {graph?.nodes.map((n, i) => (
                <li key={i}>
                  {(n as { name?: string }).name ?? 'endpoint'} ·{' '}
                  <span style={{ color: 'var(--muted)' }}>{(n as { environment?: string }).environment ?? 'prod'}</span>
                </li>
              ))}
            </ul>
          )}
          {graph?.edges?.length ? (
            <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {graph.edges.slice(0, 12).map((e, i) => (
                <div key={i}>
                  {e.from.slice(0, 8)}… → {e.label}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="sentinel-card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
            SUGERENCIAS (heurísticas)
          </div>
          {suggestions.length === 0 && !loading ? (
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Sin sugerencias recientes.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', lineHeight: 1.55 }}>
              {suggestions.map((s) => (
                <li key={s.id} style={{ marginBottom: '6px' }}>
                  {s.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
          HISTORIAL IA + ACCIONES
        </div>
        <div style={{ maxHeight: '220px', overflow: 'auto', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {aiLog.length === 0 && !loading ? (
            <span>Sin entradas.</span>
          ) : (
            aiLog.map((row, i) => (
              <pre key={i} style={{ margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(row, null, 0)}
              </pre>
            ))
          )}
        </div>
      </div>

      <div className="sentinel-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
          MÉTRICAS pipeline (muestras recientes)
        </div>
        <div style={{ maxHeight: '160px', overflow: 'auto', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {metrics.length === 0 && !loading ? (
            <span>Sin métricas aún (procesá eventos en el Worker).</span>
          ) : (
            metrics.slice(0, 40).map((row, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                {JSON.stringify(row)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
