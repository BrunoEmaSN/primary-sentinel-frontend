import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API y webhooks',
  description: 'Autenticación JWT, cliente HTTP y endpoints del backend Primary Sentinel.',
};

export default function DocsApiPage() {
  return (
    <>
      <h1>API y webhooks</h1>
      <p>
        El frontend habla con tu backend mediante HTTP. Las peticiones autenticadas envían el token de sesión de Supabase
        como <strong>Bearer JWT</strong> en la cabecera <code>Authorization</code>. El token se obtiene con{' '}
        <code>supabase.auth.getSession()</code> (o el flujo equivalente en el cliente).
      </p>

      <h2>Cliente en el código</h2>
      <p>
        La capa de llamadas está centralizada en <code>src/lib/api.ts</code>: conviene mantener ahí las rutas y cabeceras
        para no duplicar lógica en los componentes.
      </p>

      <h2>Endpoints habituales</h2>
      <p>Patrones típicos expuestos por el Worker (ajustá el prefijo según tu despliegue):</p>
      <table>
        <thead>
          <tr>
            <th>Método</th>
            <th>Ruta</th>
            <th>Uso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/api/endpoints</code>
            </td>
            <td>Crear endpoint</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/endpoints</code>
            </td>
            <td>Listar endpoints</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/endpoints/:id/events</code>
            </td>
            <td>Eventos del endpoint</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/endpoints/:id/rules</code>
            </td>
            <td>Reglas IA del endpoint</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/dlq</code>
            </td>
            <td>Dead Letter Queue</td>
          </tr>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/webhook/:tenantId/:slug</code>
            </td>
            <td>Webhook de prueba / ingesta</td>
          </tr>
        </tbody>
      </table>

      <h2>Base URL</h2>
      <p>
        La URL base del API la define <code>NEXT_PUBLIC_API_URL</code> en tu entorno (local o producción). Asegurate de
        que el backend tenga CORS configurado para el origen del frontend.
      </p>
    </>
  );
}
