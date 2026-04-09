import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px', lineHeight: 1.65 }}>
      <Link href="/" style={{ fontSize: '12px', color: 'var(--accent)' }}>
        ← Inicio
      </Link>
      <h1 style={{ fontSize: '1.5rem', marginTop: '24px', marginBottom: '16px' }}>Privacidad</h1>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        Plantilla informativa. Completa según el tratamiento real (proveedores: Supabase, Cloudflare, Resend, etc.), bases
        legales y derechos ARCO/RGPD según jurisdicción.
      </p>
      <h2 style={{ fontSize: '1rem', marginTop: '28px' }}>Datos que procesamos</h2>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        Cuenta (email, identificador de tenant), payloads enviados a tus endpoints configurados, registros operativos y
        métricas necesarias para el servicio.
      </p>
      <h2 style={{ fontSize: '1rem', marginTop: '28px' }}>Conservación</h2>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        Los plazos dependen de tu configuración y de la cola de eventos; la DLQ puede almacenar copias en almacenamiento
        objeto para auditoría.
      </p>
    </div>
  );
}
