import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: 'Centro de notificaciones en el panel y canales del tenant en Primary Sentinel.',
};

export default function DocsNotificacionesPage() {
  return (
    <>
      <h1>Notificaciones en el panel</h1>
      <p>
        La ruta <code>/dashboard/notifications</code> concentra alertas <strong>en tiempo real</strong> dentro del
        producto. El frontend se suscribe a la tabla <code>notifications</code> en Supabase mediante{' '}
        <strong>Realtime</strong>, de modo que los avisos aparecen sin recargar cuando el backend inserta filas para tu{' '}
        <strong>tenant</strong>.
      </p>

      <h2>Qué debe hacer el backend</h2>
      <p>
        La API del SaaS debe insertar filas en <code>notifications</code> ante hitos relevantes (reglas, sanaciones,
        casos irrecuperables, etc.). El <code>tenant_id</code> debe alinearse con el usuario autenticado para que las
        políticas <strong>RLS</strong> solo entreguen las notificaciones propias.
      </p>

      <h2>Esquema sugerido (SQL)</h2>
      <pre>
        <code>{`create table notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references auth.users(id),
  type text check (type in ('healed','dead','rule_created','rule_pending','info')),
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;
create policy "Own notifications" on notifications
  for all using (auth.uid() = tenant_id);`}</code>
      </pre>

      <p>
        Los tipos pueden extenderse si el producto lo requiere; mantené coherencia con lo que el panel muestra.
      </p>

      <h2>Email, Slack y webhooks</h2>
      <p>
        Además del centro en pantalla, podés activar <strong>Resend</strong>, <strong>Slack</strong> y un{' '}
        <strong>webhook de alertas firmado</strong> desde <a href="/docs/configuracion">Configuración</a>, para llevar el
        mismo tipo de incidentes a los canales de tu equipo.
      </p>
    </>
  );
}
