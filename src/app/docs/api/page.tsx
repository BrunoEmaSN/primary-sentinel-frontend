import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API y webhooks',
  description: 'Autenticación JWT, rutas REST del SaaS Primary Sentinel y webhooks de ingesta.',
};

export default function DocsApiPage() {
  return (
    <>
      <h1>API y webhooks</h1>
      <p>
        El panel es un cliente del <strong>API del producto</strong> (p. ej. Cloudflare Worker). Las peticiones
        autenticadas envían el <strong>JWT de sesión de Supabase</strong> en{' '}
        <code>Authorization: Bearer &lt;token&gt;</code>; el backend valida el usuario y aplica el aislamiento por{' '}
        <strong>tenant</strong>. Las rutas públicas de ingesta por webhook no usan ese JWT (usan el path con{' '}
        <code>tenantId</code> y el slug del endpoint).
      </p>

      <h2>Cliente en el código</h2>
      <p>
        La capa HTTP está centralizada en <code>src/lib/api.ts</code>: ahí conviene mantener paths, reintentos y cabeceras
        para no duplicar lógica en los componentes.
      </p>

      <h2>Endpoints habituales (REST)</h2>
      <p>Patrones expuestos por el Worker (prefijo según tu despliegue de <code>NEXT_PUBLIC_API_URL</code>):</p>
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
              <code>PATCH</code>
            </td>
            <td>
              <code>/api/endpoints/:id</code>
            </td>
            <td>Actualizar endpoint</td>
          </tr>
          <tr>
            <td>
              <code>DELETE</code>
            </td>
            <td>
              <code>/api/endpoints/:id</code>
            </td>
            <td>Eliminar endpoint</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/endpoints</code>
            </td>
            <td>Listar endpoints del tenant</td>
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
              <code>PATCH</code>
            </td>
            <td>
              <code>/api/endpoints/:endpointId/rules/:ruleId</code>
            </td>
            <td>Actualizar regla</td>
          </tr>
          <tr>
            <td>
              <code>DELETE</code>
            </td>
            <td>
              <code>/api/endpoints/:endpointId/rules/:ruleId</code>
            </td>
            <td>Eliminar regla</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/dlq</code>
            </td>
            <td>Listar Dead Letter</td>
          </tr>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/api/dlq/:id/reinject</code>
            </td>
            <td>Reinyectar evento DLQ</td>
          </tr>
          <tr>
            <td>
              <code>DELETE</code>
            </td>
            <td>
              <code>/api/dlq/:id</code>
            </td>
            <td>Descartar ítem DLQ</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/dlq/:eventId/snapshots</code>
            </td>
            <td>Snapshots de un evento</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/settings</code>
            </td>
            <td>Preferencias del tenant</td>
          </tr>
          <tr>
            <td>
              <code>PUT</code>
            </td>
            <td>
              <code>/api/settings</code>
            </td>
            <td>Guardar preferencias</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/billing/status</code>
            </td>
            <td>Plan y notas de facturación</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/operations/dependency-graph</code>
            </td>
            <td>Mapa endpoint → destinos</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/operations/ai-history</code>
            </td>
            <td>Historial de decisiones IA</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/metrics/pipeline</code>
            </td>
            <td>Métricas de pipeline (query hours)</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/suggestions/heuristics</code>
            </td>
            <td>Sugerencias heurísticas</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/api/public/slo</code>
            </td>
            <td>SLO público (sin JWT)</td>
          </tr>
        </tbody>
      </table>

      <h2>Webhook de ingesta</h2>
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
              <code>/webhook/:tenantId/:slug</code>
            </td>
            <td>Ingesta de eventos (cuerpo JSON)</td>
          </tr>
        </tbody>
      </table>

      <h2>Base URL y CORS</h2>
      <p>
        La URL base la define <code>NEXT_PUBLIC_API_URL</code> en cada entorno. El backend debe permitir el origen del
        frontend (p. ej. tu dominio Vercel) en la configuración CORS / <code>ALLOWED_ORIGINS</code>.
      </p>
    </>
  );
}
