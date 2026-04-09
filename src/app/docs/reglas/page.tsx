import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reglas IA',
  description: 'Reglas de reparación por tenant en Primary Sentinel SaaS.',
};

export default function DocsReglasPage() {
  return (
    <>
      <h1>Reglas IA</h1>
      <p>
        En <code>/dashboard/rules</code> gestionás las <strong>reglas de transformación / reparación</strong> del producto.
        El motor puede proponer reglas a partir del análisis de eventos; vos las revisás en el contexto de tu{' '}
        <strong>tenant</strong> antes de activarlas en producción.
      </p>

      <h2>Estados</h2>
      <p>
        Las reglas pueden mostrarse como pendientes de aprobación, activas u otros estados según el backend. El panel usa
        píldoras de color coherentes con el resto del SaaS para identificar el estado de un vistazo.
      </p>

      <h2>Aprobar y editar</h2>
      <p>
        Podés revisar el contenido sugerido, aprobar para que entre en vigor o ajustar condiciones y acciones antes de
        activar. Todo queda acotado a tu organización en el modelo multi-tenant.
      </p>

      <h2>Eliminar</h2>
      <p>
        Las reglas obsoletas o erróneas se pueden eliminar desde el gestor; suelen pedirse confirmaciones para evitar
        borrados accidentales.
      </p>
    </>
  );
}
