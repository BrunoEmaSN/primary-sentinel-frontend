import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Vista principal del tenant en Primary Sentinel: métricas, flujo y actividad.',
};

export default function DocsDashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <p>
        <code>/dashboard</code> es la entrada al producto tras iniciar sesión. Resume el estado de <strong>tu</strong>{' '}
        cuenta SaaS (métricas del día, DLQ, reglas y actividad) antes de profundizar en flujos, operaciones o incidentes.
      </p>

      <h2>Tarjetas de métricas</h2>
      <p>
        Indicadores como eventos del día, reglas sanadas o pendientes, volumen en Dead Letter y una tasa de sanación
        aproximada. Sirven para un control rápido de salud del tenant.
      </p>

      <h2>Diagrama de flujo</h2>
      <p>
        Relaciona tus <strong>endpoints</strong> con el flujo de eventos y el estado de los nodos. Es la vista “mapa”
        antes de abrir <a href="/docs/flujos">Flujos</a> o <a href="/docs/operaciones">Operaciones</a>.
      </p>

      <h2>Eventos recientes</h2>
      <p>
        Listado compacto de última actividad. Para inspección por endpoint o pruebas de webhook, usá la sección Flujos.
      </p>

      <h2>Gráfico de actividad y agente</h2>
      <p>
        Evolución temporal de eventos y un bloque de estado del agente de reglas IA asociado a tus pipelines.
      </p>
    </>
  );
}
