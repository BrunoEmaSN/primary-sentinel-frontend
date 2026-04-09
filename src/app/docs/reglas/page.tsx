import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('reglas');
}

export default async function DocsReglasPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.reglas;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hState}</h2>
      <DocHtml html={p.pState} />

      <h2>{p.hApprove}</h2>
      <DocHtml html={p.pApprove} />

      <h2>{p.hDelete}</h2>
      <DocHtml html={p.pDelete} />
    </>
  );
}
