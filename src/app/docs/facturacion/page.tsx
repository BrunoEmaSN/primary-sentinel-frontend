import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facturación',
  description: 'Planes, límites del plan free y roadmap de pagos en Primary Sentinel SaaS.',
};

export default function DocsFacturacionPage() {
  return (
    <>
      <h1>Facturación y planes</h1>
      <p>
        Primary Sentinel es un <strong>producto SaaS multi-tenant</strong>: cada organización o equipo trabaja en su propio
        espacio aislado (tenant), con límites y facturación asociados al plan contratado.
      </p>

      <h2>Pantalla Facturación</h2>
      <p>
        En <code>/dashboard/billing</code> ves el <strong>plan actual</strong> y notas que devuelve el backend (por ejemplo
        estado del proveedor de pagos o mensajes operativos). Desde ahí podés volver a{' '}
        <a href="/docs/configuracion">Configuración</a> para revisar el mismo plan en el resumen de cuenta.
      </p>

      <h2>Plan free y límites</h2>
      <p>
        En la fase actual, el plan gratuito aplica <strong>límites en la API</strong> (por ejemplo un número acotado de
        pipelines activos). Los límites concretos pueden evolucionar; la pantalla de configuración y la respuesta del API
        de facturación reflejan lo que aplica a tu tenant.
      </p>

      <h2>Roadmap: Stripe y portal de cliente</h2>
      <p>
        La integración con <strong>Stripe</strong> y un <strong>portal de cliente</strong> para cambiar plan, método de
        pago y facturas está prevista en el roadmap del producto. Hasta entonces, los upgrades o acuerdos enterprise se
        gestionan fuera de la app o con el equipo de Primary Sentinel.
      </p>

      <h2>API</h2>
      <p>
        El estado de facturación expuesto al panel proviene de <code>GET /api/billing/status</code> (autenticado). Más
        detalle en <a href="/docs/api">API y webhooks</a>.
      </p>
    </>
  );
}
