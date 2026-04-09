import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dead Letter',
  description: 'Cola DLQ por tenant, reinyección, snapshots y descarte en Primary Sentinel.',
};

export default function DocsDlqPage() {
  return (
    <>
      <h1>Dead Letter Queue</h1>
      <p>
        <code>/dashboard/dlq</code> lista los eventos que el sistema <strong>no pudo sanar</strong> de forma automática.
        Es la cola de revisión humana del SaaS: inspeccionás el payload, el motivo del fallo y, cuando el backend lo
        permite, podés <strong>reinyectar</strong> el evento o <strong>descartarlo</strong>. Solo ves ítems de tu tenant.
      </p>

      <h2>Cuándo aparece un ítem</h2>
      <p>
        Suelen ser errores recurrentes, datos fuera de esquema o situaciones no cubiertas por las reglas actuales. Es el
        lugar para priorizar mejoras de reglas o correcciones en los productores upstream.
      </p>

      <h2>Reinyección y snapshots</h2>
      <p>
        La API expone reinyección con payload corregido opcional (<code>POST /api/dlq/:id/reinject</code>), listado de
        snapshots por evento y comparación entre versiones para auditoría. El comportamiento exacto depende de la versión
        desplegada del Worker.
      </p>

      <h2>Descarte</h2>
      <p>
        Podés eliminar un registro DLQ cuando decidís no reprocesarlo (<code>DELETE /api/dlq/:id</code>), de acuerdo con
        las políticas de retención del backend.
      </p>
    </>
  );
}
