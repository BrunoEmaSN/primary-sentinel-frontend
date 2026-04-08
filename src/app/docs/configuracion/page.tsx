import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración',
  description: 'Ajustes del Sentinel y estado de infraestructura en el panel.',
};

export default function DocsConfiguracionPage() {
  return (
    <>
      <h1>Configuración</h1>
      <p>
        En <code>/dashboard/settings</code> centralizás parámetros del producto y podés ver el <strong>estado de la
        infraestructura</strong> conectada (por ejemplo disponibilidad del backend o metadatos útiles para soporte).
      </p>

      <h2>Destinos y ajustes</h2>
      <p>
        Según la versión del panel, aquí podés definir preferencias del Sentinel, revisar selectores de destino o
        configuraciones que afectan cómo se comportan los flujos y las integraciones. Los campos concretos dependen de tu
        despliegue del backend.
      </p>

      <h2>Variables de entorno</h2>
      <p>
        Recordá que las claves públicas (<code>NEXT_PUBLIC_*</code>) se definen en el entorno de build o en Vercel; no se
        editan desde esta pantalla. Para desarrollo local usá <code>.env.local</code> como se describe en{' '}
        <a href="/docs/empezar">Primeros pasos</a>.
      </p>
    </>
  );
}
