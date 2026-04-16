import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

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
      <DocHtml html={p.pSchema} />

      <h2>{p.hChannels}</h2>
      <DocHtml html={p.pChannels} />
    </>
  );
}
