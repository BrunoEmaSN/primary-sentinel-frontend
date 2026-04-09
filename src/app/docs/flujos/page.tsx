import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('flujos');
}

export default async function DocsFlujosPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.flujos;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hCreate}</h2>
      <DocHtml html={p.pCreate} />

      <h2>{p.hWebhook}</h2>
      <DocHtml html={p.pWebhook} />

      <h2>{p.hEvents}</h2>
      <DocHtml html={p.pEvents} />
    </>
  );
}
