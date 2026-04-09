import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración',
  description: 'Cuenta SaaS, tenant, notificaciones e infraestructura en Primary Sentinel.',
};

export default function DocsConfiguracionPage() {
  return (
    <>
      <h1>Configuración</h1>
      <p>
        <code>/dashboard/settings</code> agrupa la <strong>cuenta del tenant</strong>, preferencias de notificación e
        información de infraestructura del servicio. Los cambios sensibles se guardan vía API autenticada (
        <code>PUT /api/settings</code>).
      </p>

      <h2>Cuenta y plan</h2>
      <p>
        Ves tu email, el <strong>Tenant ID</strong> (útil para componer URLs de webhook de ingesta) y el{' '}
        <strong>plan</strong> actual del SaaS. El plan free incluye límites en API (p. ej. pipelines activos); más
        detalle en <a href="/docs/facturacion">Facturación</a>.
      </p>

      <h2>Notificaciones: Resend, Slack y webhook firmado</h2>
      <p>
        Podés activar envío por <strong>email</strong> (reparaciones, DLQ, reglas pendientes), un{' '}
        <strong>Incoming Webhook de Slack</strong> para resúmenes de incidente, y un <strong>webhook HTTPS propio</strong>{' '}
        con firma <code>HMAC-SHA256</code> en la cabecera <code>X-Sentinel-Signature</code> (secreto compartido
        configurable). Son canales paralelos al centro de notificaciones en el panel.
      </p>

      <h2>Infraestructura (referencia)</h2>
      <p>
        La pantalla resume el origen del <strong>API</strong> (URL del Worker), y el stack típico del producto: Supabase
        (Postgres), cache (p. ej. Redis/Upstash), almacenamiento para DLQ (p. ej. R2) y email (Resend). Es informativo
        para soporte y transparencia operativa; no sustituye el panel del proveedor cloud.
      </p>

      <h2>Variables de entorno del frontend</h2>
      <p>
        Las claves públicas (<code>NEXT_PUBLIC_*</code>) se definen en build o en Vercel; no se editan desde esta
        pantalla. Para desarrollo local usá <code>.env.local</code> como en <a href="/docs/empezar">Primeros pasos</a>.
      </p>
    </>
  );
}
