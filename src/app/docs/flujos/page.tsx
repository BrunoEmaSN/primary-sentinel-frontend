import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flujos',
  description: 'Endpoints, webhooks de ingesta por tenant y pruebas en Primary Sentinel.',
};

export default function DocsFlujosPage() {
  return (
    <>
      <h1>Flujos</h1>
      <p>
        En <code>/dashboard/flows</code> administrás los <strong>endpoints</strong> del SaaS: cada uno pertenece a tu{' '}
        <strong>tenant</strong> y tiene metadatos, esquema, destinos y una <strong>URL de webhook</strong> que tus
        sistemas invocan para enviar eventos (prueba o producción).
      </p>

      <h2>Crear y editar endpoints</h2>
      <p>
        Los cambios quedan persistidos en el backend multi-tenant; el panel usa el JWT de sesión para que solo veas y
        modifiques recursos de tu cuenta.
      </p>

      <h2>Webhook de ingesta</h2>
      <p>
        El backend expone <code>POST /webhook/:tenantId/:slug</code>. El <code>tenantId</code> coincide con el
        identificador de usuario/tenant que mostramos en <a href="/docs/configuracion">Configuración</a>. Las llamadas al
        API REST autenticado usan <code>Authorization: Bearer &lt;JWT&gt;</code> (ver{' '}
        <a href="/docs/api">API y webhooks</a>).
      </p>

      <h2>Eventos por endpoint</h2>
      <p>
        Podés listar y revisar eventos asociados a un endpoint para depurar integraciones antes de que actúen las reglas
        IA o terminen en DLQ.
      </p>
    </>
  );
}
