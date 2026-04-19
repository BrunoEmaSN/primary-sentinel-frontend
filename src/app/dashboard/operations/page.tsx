'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getDependencyGraph,
  getAiHistory,
  getStageMetrics,
  getHeuristicSuggestions,
} from '@/lib/api';
import { IconArrowRight } from '@/components/icons/Arrows';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function OperationsPage() {
  const { dict } = useI18n();
  const o = dict.dashboard.operations;
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
      getStageMetrics(48),
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{o.title}</div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--muted)',
            marginTop: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{o.introBefore}</span>
          <IconArrowRight size={10} style={{ color: 'var(--muted)' }} />
          <span>{o.introAfter}</span>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)', fontSize: '11px' }}>{dict.dashboard.loading.operations}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="sentinel-card">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            <span>{o.mapTitleBefore}</span>
            <IconArrowRight size={12} style={{ color: 'var(--accent)' }} />
            <span>{o.mapTitleAfter}</span>
          </div>
          {!graph?.nodes?.length && !loading ? (
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{o.noEndpoints}</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: 'var(--text)', lineHeight: 1.6 }}>
              {graph?.nodes.map((n, i) => (
                <li key={i}>
                  {(n as { name?: string }).name ?? o.endpointFallback} ·{' '}
                  <span style={{ color: 'var(--muted)' }}>{(n as { environment?: string }).environment ?? o.envFallback}</span>
                </li>
              ))}
            </ul>
          )}
          {graph?.edges?.length ? (
            <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {graph.edges.slice(0, 12).map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>{e.from.slice(0, 8)}…</span>
                  <IconArrowRight size={10} style={{ color: 'var(--border2)' }} />
                  <span>{e.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="sentinel-card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
            {o.suggestionsTitle}
          </div>
          {suggestions.length === 0 && !loading ? (
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{o.noSuggestions}</div>
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
          {o.aiHistoryTitle}
        </div>
        <div style={{ maxHeight: '220px', overflow: 'auto', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {aiLog.length === 0 && !loading ? (
            <span>{o.noAiEntries}</span>
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
          {o.metricsTitle}
        </div>
        <div style={{ maxHeight: '160px', overflow: 'auto', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {metrics.length === 0 && !loading ? (
            <span>{o.noMetrics}</span>
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
