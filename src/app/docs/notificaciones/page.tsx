import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: 'Alertas en tiempo real vía Supabase Realtime en Primary Sentinel.',
};

export default function DocsNotificacionesPage() {
  return (
    <>
      <h1>Notificaciones</h1>
      <p>
        La página <code>/dashboard/notifications</code> muestra alertas en tiempo real. El frontend se suscribe a la
        tabla <code>notifications</code> en Supabase mediante <strong>Realtime</strong>, de modo que los avisos
        aparecen sin recargar la aplicación cuando el backend inserta nuevas filas.
      </p>

      <h2>Qué debe hacer el backend</h2>
      <p>
        Tu API debe insertar filas en <code>notifications</code> cuando ocurran hitos relevantes: por ejemplo una regla
        creada, un evento sanado, un caso irrecuperable o información general. El <code>tenant_id</code> debe
        corresponder al usuario autenticado para que las políticas RLS entreguen solo sus notificaciones.
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
        Ajustá los tipos (<code>type</code>) si tu producto necesita variantes adicionales; mantené coherencia con lo
        que el frontend espera mostrar.
      </p>
    </>
  );
}
