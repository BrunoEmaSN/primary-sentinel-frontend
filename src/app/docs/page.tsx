import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introducción',
  description:
    'Qué es Primary Sentinel: monitorización de pipelines, reglas de reparación con IA y gestión de incidentes.',
};

export default function DocsIntroPage() {
  return (
    <>
      <h1>Introducción</h1>
      <p>
        <strong>Primary Sentinel</strong> es un panel para monitorizar y gestionar pipelines de datos con capacidad de{' '}
        <strong>auto-reparación asistida por IA</strong>. El sistema observa eventos en tus endpoints, propone o aplica
        reglas de corrección y concentra los casos que no se pueden resolver automáticamente en la{' '}
        <strong>Dead Letter Queue (DLQ)</strong>.
      </p>

      <h2>Flujo general</h2>
      <ol>
        <li>
          <strong>Monitor</strong> — En el <strong>Dashboard</strong> ves métricas, el diagrama de flujo y los eventos
          recientes.
        </li>
        <li>
          <strong>Conectar datos</strong> — En <strong>Flujos</strong> defines endpoints y la URL de webhook que recibe
          eventos de tus sistemas.
        </li>
        <li>
          <strong>Reglas IA</strong> — El motor puede generar o sugerir reglas; las gestionás en{' '}
          <strong>Reglas IA</strong> (aprobar, editar o eliminar).
        </li>
        <li>
          <strong>Incidentes</strong> — Lo que no se puede sanar automáticamente aparece en <strong>Dead Letter</strong>{' '}
          para revisión y, si aplica, reinyección manual.
        </li>
        <li>
          <strong>Alertas</strong> — Las <strong>Notificaciones</strong> te avisan en tiempo real cuando ocurren hitos
          relevantes (según lo que inserte tu backend en Supabase).
        </li>
      </ol>

      <h2>Stack resumido</h2>
      <p>
        El frontend usa Next.js (App Router), autenticación con Supabase y llamadas HTTP a tu backend (por ejemplo un
        Cloudflare Worker). Las variables públicas de Supabase y la URL del API se configuran en el entorno; los
        detalles están en <a href="/docs/empezar">Primeros pasos</a>.
      </p>
    </>
  );
}
