import Link from 'next/link';
import { IconArrowLeft } from '@/components/icons/Arrows';

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px', lineHeight: 1.65 }}>
      <Link href="/" style={{ fontSize: '12px', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <IconArrowLeft size={14} />
        Inicio
      </Link>
      <h1 style={{ fontSize: '1.5rem', marginTop: '24px', marginBottom: '16px' }}>Términos del servicio</h1>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        Este texto es una plantilla operativa. Debe ser revisado por asesoría legal antes de producción. Primary Sentinel se
        ofrece “tal cual”; el uso del servicio implica aceptar actualizaciones razonables de estos términos con aviso en el
        producto o por correo.
      </p>
      <h2 style={{ fontSize: '1rem', marginTop: '28px' }}>Uso aceptable</h2>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        No utilices el servicio para actividades ilegales, para enviar datos personales sin base legal adecuada ni para
        eludir medidas de seguridad de terceros.
      </p>
      <h2 style={{ fontSize: '1rem', marginTop: '28px' }}>Disponibilidad</h2>
      <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
        Objetivos de disponibilidad publicados en la web son metas de producto salvo que se indique medición verificada.
      </p>
    </div>
  );
}
