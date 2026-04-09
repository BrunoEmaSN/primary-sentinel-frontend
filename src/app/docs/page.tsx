import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introducción',
  description:
    'Primary Sentinel como SaaS: multi-tenant, observabilidad de pipelines y auto-reparación asistida por IA.',
};

export default function DocsIntroPage() {
  return (
    <>
      <h1>Introducción</h1>
      <p>
        <strong>Primary Sentinel</strong> es un <strong>SaaS</strong> para equipos que necesitan{' '}
        <strong>observabilidad y gobierno</strong> sobre pipelines de datos: ingesta por webhooks, reglas de reparación
        asistidas por IA, colas de incidentes y alertas. Cada cliente trabaja en su propio <strong>tenant</strong>{' '}
        (aislamiento lógico de datos y configuración); el panel y la API usan la sesión de Supabase para aplicar esos
        límites.
      </p>

      <h2>Qué resuelve el producto</h2>
      <ul>
        <li>
          <strong>Visibilidad</strong> — Métricas, diagrama de flujo y operaciones sin montar tu propio stack de
          monitorización genérico.
        </li>
        <li>
          <strong>Acción</strong> — Reglas que corrigen o enrutan eventos problemáticos; lo que no se puede sanar va a{' '}
          <strong>Dead Letter</strong> para revisión humana.
        </li>
        <li>
          <strong>Integración</strong> — API REST y webhooks de ingesta documentados; el backend desplegado (p. ej.
          Cloudflare Worker) escala con el servicio.
        </li>
      </ul>

      <h2>Flujo general en el panel</h2>
      <ol>
        <li>
          <strong>Monitor</strong> — En el <strong>Dashboard</strong> ves métricas, el diagrama de flujo y eventos
          recientes.
        </li>
        <li>
          <strong>Conectar datos</strong> — En <strong>Flujos</strong> definís endpoints y la URL de webhook por tenant.
        </li>
        <li>
          <strong>Operaciones</strong> — En <strong>Operaciones</strong> revisás dependencias, historial IA y métricas de
          pipeline.
        </li>
        <li>
          <strong>Reglas IA</strong> — Gestionás reglas de reparación (aprobar, editar o eliminar).
        </li>
        <li>
          <strong>Incidentes</strong> — Lo que no se sanó automáticamente aparece en <strong>Dead Letter</strong> para
          reintento o descarte.
        </li>
        <li>
          <strong>Alertas</strong> — <strong>Notificaciones</strong> en el panel (Realtime) y canales configurables en{' '}
          <strong>Configuración</strong> (email, Slack, webhook firmado).
        </li>
        <li>
          <strong>Plan</strong> — <strong>Facturación</strong> resume tu plan SaaS y el roadmap de pagos.
        </li>
      </ol>

      <h2>Stack resumido</h2>
      <p>
        El frontend (Next.js) usa autenticación <strong>Supabase</strong> y llama al <strong>API del producto</strong> con
        JWT. Las variables públicas (<code>NEXT_PUBLIC_*</code>) y la URL del API se configuran por entorno (local o
        Vercel). Guía paso a paso en <a href="/docs/empezar">Primeros pasos</a>.
      </p>
    </>
  );
}
