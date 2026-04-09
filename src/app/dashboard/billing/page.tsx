'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBillingStatus } from '@/lib/api';

export default function BillingPage() {
  const [plan, setPlan] = useState<string>('—');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    void getBillingStatus().then((r) => {
      if (r.data?.plan) setPlan(r.data.plan);
      if (r.data?.note) setNote(r.data.note);
    });
  }, []);

  return (
    <div className="fade-up">
      <div className="sentinel-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>FACTURACIÓN</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.55 }}>
          Plan actual: <span style={{ color: 'var(--accent)' }}>{plan}</span>
          {note ? (
            <>
              <br />
              {note}
            </>
          ) : null}
        </div>
        <p style={{ fontSize: '11px', marginTop: '14px', color: 'var(--muted)' }}>
          Stripe y portal de cliente están previstos en la fase de planes de pago del roadmap. Los límites del plan free se
          aplican ya en la API (un endpoint activo).
        </p>
        <Link href="/dashboard/settings" className="btn-ghost" style={{ display: 'inline-block', marginTop: '12px', fontSize: '11px' }}>
          ← Configuración
        </Link>
      </div>
    </div>
  );
}
