import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reglas IA',
  description: 'Aprobar, editar y eliminar reglas de reparación generadas o sugeridas por IA.',
};

export default function DocsReglasPage() {
  return (
    <>
      <h1>Reglas IA</h1>
      <p>
        La sección <code>/dashboard/rules</code> concentra las <strong>reglas de reparación</strong> que el sistema
        propone o genera a partir del análisis de eventos. Las reglas definen cómo corregir o enrutar situaciones
        anómalas en tus pipelines.
      </p>

      <h2>Estados</h2>
      <p>
        Las reglas pueden aparecer como <strong>pendientes de aprobación</strong>, <strong>activas</strong> u otros
        estados según la implementación del backend. El panel usa etiquetas visuales (píldoras) coherentes con el resto
        de la UI para que identifiques el estado de un vistazo.
      </p>

      <h2>Aprobar y editar</h2>
      <p>
        Podés revisar el contenido de una regla sugerida, aprobarla para que pase a producción o ajustarla antes de
        activarla. La edición fina permite adaptar condiciones o acciones a tu entorno sin abandonar el flujo del
        producto.
      </p>

      <h2>Eliminar</h2>
      <p>
        Si una regla ya no aplica o fue creada por error, podés eliminarla desde el gestor. Las operaciones destructivas
        suelen requerir confirmación para evitar borrados accidentales.
      </p>
    </>
  );
}
