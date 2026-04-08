import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Métricas del día, diagrama de flujo, eventos recientes y estado del agente en Primary Sentinel.',
};

export default function DocsDashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <p>
        La ruta <code>/dashboard</code> es la vista principal después de iniciar sesión. Resume el estado del sistema y
        te da contexto rápido antes de profundizar en flujos, reglas o DLQ.
      </p>

      <h2>Tarjetas de métricas</h2>
      <p>
        Las tarjetas superiores muestran indicadores como eventos del día, reglas sanadas, reglas activas o pendientes,
        cantidad en Dead Letter y una tasa de sanación aproximada. Son útiles para detectar de un vistazo si el tráfico
        o los fallos están dentro de lo esperado.
      </p>

      <h2>Diagrama de flujo</h2>
      <p>
        El diagrama relaciona tus <strong>endpoints</strong> con el flujo de eventos. Ayuda a ver qué nodos están
        activos y cómo se conecta la ingesta con el resto del sistema.
      </p>

      <h2>Eventos recientes</h2>
      <p>
        Un listado compacto de los últimos eventos permite ver actividad reciente sin salir del dashboard. Para el detalle
        por endpoint y webhooks, usá la sección <a href="/docs/flujos">Flujos</a>.
      </p>

      <h2>Gráfico de actividad y agente</h2>
      <p>
        El gráfico de actividad muestra la evolución temporal de los eventos. El bloque de estado del agente resume el
        comportamiento de las reglas IA asociadas a tus flujos.
      </p>
    </>
  );
}
