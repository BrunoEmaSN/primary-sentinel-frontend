import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

const NOTIFICATIONS_SQL = `create table notifications (
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
  for all using (auth.uid() = tenant_id);`;

export async function generateMetadata() {
  return docsPageMetadata('notificaciones');
}

export default async function DocsNotificacionesPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.notificaciones;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hBackend}</h2>
      <DocHtml html={p.pBackend} />

      <h2>{p.hSchema}</h2>
      <pre>
        <code>{NOTIFICATIONS_SQL}</code>
      </pre>

      <p>{p.pAfterSchema}</p>

      <h2>{p.hChannels}</h2>
      <DocHtml html={p.pChannels} />
    </>
  );
}
