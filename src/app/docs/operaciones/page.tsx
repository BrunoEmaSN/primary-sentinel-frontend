import type { Metadata } from 'next';
import { IconArrowRight } from '@/components/icons/Arrows';

export const metadata: Metadata = {
  title: 'Operaciones',
  description:
    'Mapa de dependencias, historial IA, métricas de pipeline y sugerencias heurísticas en Primary Sentinel.',
};

export default function DocsOperacionesPage() {
  return (
    <>
      <h1>Operaciones</h1>
      <p>
        La vista <code>/dashboard/operations</code> está pensada para <strong>operadores</strong> del SaaS: resume cómo
        se conectan tus endpoints con destinos, qué decisiones tomó el motor de IA recientemente y cómo evolucionan las
        métricas por etapa (Worker{' '}
        <IconArrowRight size={12} style={{ verticalAlign: 'middle', display: 'inline-block', margin: '0 2px' }} />{' '}
        Supabase). Los datos son <strong>por tenant</strong>: solo ves lo asociado a tu cuenta.
      </p>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        Mapa endpoint <IconArrowRight size={14} style={{ color: 'var(--accent)' }} /> destinos
      </h2>
      <p>
        Muestra nodos (tus pipelines) y aristas que relacionan orígenes con destinos. Sirve para entender el grafo de
        dependencias sin abrir cada flujo por separado. Si aún no creaste endpoints, verás un estado vacío hasta que
        configures <a href="/docs/flujos">Flujos</a>.
      </p>

      <h2>Historial de decisiones IA</h2>
      <p>
        Lista eventos recientes del historial de razonamiento o acciones automáticas, acotado en tiempo. Complementa el
        detalle que más adelante podés ver en reglas o en eventos concretos.
      </p>

      <h2>Métricas de pipeline</h2>
      <p>
        Serie temporal de métricas por ventana de horas (por defecto un rango amplio) para detectar picos, caídas o
        estancamiento. El backend agrega datos; la UI las presenta de forma compacta.
      </p>

      <h2>Sugerencias heurísticas</h2>
      <p>
        El API puede devolver sugerencias basadas en muestras recientes (severidad + texto). Son orientativas para
        priorizar mejoras de esquema, reglas o conectividad, no sustituyen el juicio del equipo.
      </p>

      <h2>API relacionada</h2>
      <p>
        Las rutas usadas por esta pantalla incluyen <code>GET /api/operations/dependency-graph</code>,{' '}
        <code>GET /api/operations/ai-history</code>, <code>GET /api/metrics/pipeline</code> y{' '}
        <code>GET /api/suggestions/heuristics</code>. Requieren JWT de sesión; detalle en{' '}
        <a href="/docs/api">API y webhooks</a>.
      </p>
    </>
  );
}
