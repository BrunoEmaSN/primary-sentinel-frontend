'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

type SectionProps = {
  title: string;
  children: ReactNode;
};

type RowProps = {
  label: string;
  sub?: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="sentinel-card" style={{ marginBottom: '16px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, sub, children }: RowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }


  return (
    <div className="fade-up">
      <Section title="CUENTA">
        <Row label="Email" sub="Tu dirección de email registrada">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            {user?.email ?? '—'}
          </span>
        </Row>
        <Row label="Tenant ID" sub="Usalo en tus URLs de webhook">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)' }}>
              {user?.id?.slice(0, 16) ?? '—'}…
            </span>
            <button
              onClick={() => user && navigator.clipboard.writeText(user.id)}
              className="btn-ghost" style={{ fontSize: '9px', padding: '3px 8px' }}
            >
              Copiar
            </button>
          </div>
        </Row>
        <Row label="Plan" sub="Plan actual">
          <span className="pill pill-active">FREE</span>
        </Row>
      </Section>

      <Section title="CONFIGURACIÓN DE PRIMARY SENTINEL">
        <Row label="Umbral de auto-aprobación" sub="Reglas con confianza ≥ X se activan automáticamente">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="range" min={50} max={100} defaultValue={95} style={{ width: '100px' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', minWidth: '32px' }}>95%</span>
          </div>
        </Row>
        <Row label="Máx. reintentos antes de DLQ" sub="Por evento">
          <select className="sentinel-input" style={{ width: '80px' }} defaultValue="3">
            {[1,2,3,5,10].map(n => <option key={n}>{n}</option>)}
          </select>
        </Row>
        <Row label="Auto-aplicar reglas IA" sub="Sin esperar aprobación humana (requiere confianza ≥ umbral)">
          <input type="checkbox" defaultChecked />
        </Row>
        <Row label="Cuarentena automática" sub="Desactivar reglas con tasa de éxito < 30%">
          <input type="checkbox" defaultChecked />
        </Row>
        <div style={{ paddingTop: '10px' }}>
          <Row label="Modelo IA" sub="Modelo de Claude usado para generar reglas de transformación">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--teal)' }}>claude-sonnet-4</span>
          </Row>
        </div>
      </Section>

      <Section title="NOTIFICACIONES">
        <Row label="Email en reparaciones" sub="Recibir email cuando la IA repara automáticamente un evento">
          <input type="checkbox" defaultChecked />
        </Row>
        <Row label="Email en eventos DLQ" sub="Recibir email cuando un evento es irrecuperable">
          <input type="checkbox" defaultChecked />
        </Row>
        <Row label="Email en reglas pendientes" sub="Cuando la IA genera una regla que necesita aprobación">
          <input type="checkbox" defaultChecked />
        </Row>
        <Row label="Webhook de Slack" sub="URL del webhook de Slack para alertas">
          <input className="sentinel-input" style={{ width: '280px' }} placeholder="https://hooks.slack.com/services/..." />
        </Row>
      </Section>

      <Section title="INFRAESTRUCTURA">
        <Row label="Backend URL" sub="Cloudflare Worker URL">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>{API_URL}</span>
        </Row>
        <Row label="Base de datos" sub="Supabase PostgreSQL">
          <span className="pill pill-active">CONECTADO</span>
        </Row>
        <Row label="Cache (Redis)" sub="Upstash Redis para reglas en caché">
          <span className="pill pill-active">CONECTADO</span>
        </Row>
        <Row label="Storage (DLQ)" sub="Cloudflare R2">
          <span className="pill pill-active">CONECTADO</span>
        </Row>
        <div style={{ paddingTop: '0', borderBottom: 'none' }}>
          <Row label="Email (Resend)" sub="Para notificaciones">
            <span className="pill pill-active">CONECTADO</span>
          </Row>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={handleSave}>
          {saved ? '✔ Guardado' : 'Guardar cambios'}
        </button>
        <button className="btn-ghost">Cancelar</button>
      </div>
    </div>
  );
}
