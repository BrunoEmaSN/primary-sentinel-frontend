import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dead Letter',
  description: 'Cola de eventos irrecuperables y reinyección manual en Primary Sentinel.',
};

export default function DocsDlqPage() {
  return (
    <>
      <h1>Dead Letter Queue</h1>
      <p>
        La ruta <code>/dashboard/dlq</code> muestra los eventos que el sistema <strong>no pudo sanar</strong> de forma
        automática. Actúa como cola de revisión humana: podés inspeccionar el payload, entender el motivo del fallo y,
        cuando el backend lo permita, lanzar una <strong>reinyección manual</strong> hacia el flujo.
      </p>

      <h2>Cuándo aparece un ítem</h2>
      <p>
        Los registros suelen corresponder a errores recurrentes, datos fuera de esquema o situaciones que las reglas IA
        existentes no cubren. Es el lugar donde priorizar mejoras de reglas o correcciones upstream en tus productores de
        datos.
      </p>

      <h2>Reinyección</h2>
      <p>
        Desde la interfaz podés solicitar que un evento vuelva a procesarse tras corregir la causa raíz o actualizar las
        reglas. El comportamiento exacto depende de tu implementación en el Worker/backend.
      </p>
    </>
  );
}
