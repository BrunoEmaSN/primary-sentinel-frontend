'use client';

import { useEffect, useState } from 'react';
import { listEndpoints, listRules, updateRule, deleteRule } from '@/lib/api';
import type { TransformationRule, Endpoint } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function RulesPage() {
  const [rules, setRules] = useState<TransformationRule[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<TransformationRule | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'quarantined'>('all');

  async function load() {
    const eps = await listEndpoints();
    setEndpoints(eps);
    const allRules: TransformationRule[] = [];
    await Promise.all(eps.map(async ep => {
      const r = await listRules(ep.id);
      allRules.push(...r);
    }));
    allRules.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRules(allRules);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function approve(rule: TransformationRule) {
    await updateRule(rule.endpoint_id, rule.id, { status: 'active' });
    load();
  }

  async function deactivate(rule: TransformationRule) {
    await updateRule(rule.endpoint_id, rule.id, { status: 'inactive' });
    load();
  }

  async function remove(rule: TransformationRule) {
    if (!confirm(`¿Eliminar regla "${rule.name}"?`)) return;
    await deleteRule(rule.endpoint_id, rule.id);
    load();
  }

  const filtered = rules.filter(r => filter === 'all' || r.status === filter);
  const pendingCount = rules.filter(r => r.status === 'pending').length;

  const statusPill = (status: string) => {
    const map: Record<string, string> = {
      active: 'pill-active',
      pending: 'pill-pending',
      inactive: 'pill-inactive',
      quarantined: 'pill-dead',
    };
    return map[status] || 'pill-inactive';
  };

  return (
    <div className="fade-up">
      <div className="sentinel-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>GESTOR DE REGLAS</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
              Revisá, aprobá o editá las reglas generadas por la IA
              {pendingCount > 0 && (
                <span style={{ color: 'var(--amber)', marginLeft: '8px' }}>
                  · {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''} de aprobación
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'pending', 'active', 'quarantined'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 10px', borderRadius: '5px', fontSize: '9px',
                  fontFamily: 'var(--font-mono)', cursor: 'pointer', border: 'none',
                  background: filter === f ? 'var(--accent)' : 'var(--bg2)',
                  color: filter === f ? '#0a0b0d' : 'var(--muted)',
                  fontWeight: filter === f ? 700 : 400,
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '11px' }}>Cargando reglas…</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Sin reglas {filter !== 'all' ? `"${filter}"` : ''}</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>Las reglas se generan automáticamente cuando la IA detecta y repara un error</div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <table className="sentinel-table">
            <thead>
              <tr>
                <th>NOMBRE / DESCRIPCIÓN</th>
                <th>ORIGEN</th>
                <th>ESTADO</th>
                <th>CONFIANZA</th>
                <th>ÉXITOS</th>
                <th>CREADA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rule => (
                <tr key={rule.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', cursor: 'pointer' }}
                      onClick={() => setSelectedRule(rule)}>
                      {rule.name}
                    </div>
                    {rule.description && (
                      <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{rule.description}</div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: rule.source === 'ai' ? 'var(--teal)' : 'var(--blue)' }}>
                      {rule.source === 'ai' ? '★ IA' : '♦ Humano'}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${statusPill(rule.status)}`}>{rule.status.toUpperCase()}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: rule.confidence && rule.confidence > 90 ? 'var(--accent)' : 'var(--amber)' }}>
                      {rule.confidence ? `${rule.confidence.toFixed(1)}%` : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                      {rule.success_count}/{rule.success_count + rule.failure_count}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      {formatDistanceToNow(new Date(rule.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {rule.status === 'pending' && (
                        <button
                          onClick={() => approve(rule)}
                          style={{ background: 'rgba(200,245,80,.1)', color: 'var(--accent)', border: '1px solid rgba(200,245,80,.25)', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Aprobar"
                        >✔</button>
                      )}
                      <button
                        onClick={() => setSelectedRule(rule)}
                        style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '11px' }}
                        title="Ver script"
                      >✎</button>
                      {rule.status === 'active' && (
                        <button
                          onClick={() => deactivate(rule)}
                          style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '11px' }}
                          title="Desactivar"
                        >◉</button>
                      )}
                      <button
                        onClick={() => remove(rule)}
                        style={{ background: 'transparent', color: 'var(--red)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '11px' }}
                        title="Eliminar"
                      >✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rule detail modal */}
      {selectedRule && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={e => { if (e.target === e.currentTarget) setSelectedRule(null); }}>
          <div className="sentinel-card fade-up" style={{ width: '600px', maxWidth: '100%', maxHeight: '80vh', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>{selectedRule.name}</div>
              <button onClick={() => setSelectedRule(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <span className={`pill ${statusPill(selectedRule.status)}`}>{selectedRule.status.toUpperCase()}</span>
              <span style={{ fontSize: '10px', color: selectedRule.source === 'ai' ? 'var(--teal)' : 'var(--blue)', fontFamily: 'var(--font-mono)' }}>
                {selectedRule.source === 'ai' ? '★ Generada por IA' : '♦ Creada manualmente'}
              </span>
              {selectedRule.confidence && (
                <span style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  Confianza: {selectedRule.confidence.toFixed(1)}%
                </span>
              )}
            </div>
            {selectedRule.description && (
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>{selectedRule.description}</div>
            )}
            <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '6px' }}>
              SCRIPT DE TRANSFORMACIÓN
            </div>
            <pre style={{
              background: 'var(--bg2)', borderRadius: '6px', padding: '14px',
              fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text)',
              border: '1px solid var(--border)', overflowX: 'auto', whiteSpace: 'pre-wrap',
            }}>
              {selectedRule.script || '// Script generado por Claude\n// Se ejecuta en sandbox aislado\n\nfunction transform(payload) {\n  // Transformación aquí\n  return payload;\n}'}
            </pre>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end' }}>
              {selectedRule.status === 'pending' && (
                <button className="btn-primary" onClick={() => { approve(selectedRule); setSelectedRule(null); }}>
                  ✔ Aprobar regla
                </button>
              )}
              <button className="btn-ghost" onClick={() => setSelectedRule(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
