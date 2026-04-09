import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('dlq');
}

export default async function DocsDlqPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.dlq;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hWhen}</h2>
      <DocHtml html={p.pWhen} />

      <h2>{p.hReinject}</h2>
      <DocHtml html={p.pReinject} />

      <h2>{p.hDiscard}</h2>
      <DocHtml html={p.pDiscard} />
    </>
  );
}
