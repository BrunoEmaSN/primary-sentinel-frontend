import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('operaciones');
}

export default async function DocsOperacionesPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.operaciones;

  return (
    <>
      <h1>{p.title}</h1>
      <p>
        <DocHtml html={p.p1} as="span" />
      </p>

      <h2>{p.hMap}</h2>
      <DocHtml html={p.pMap} />

      <h2>{p.hAi}</h2>
      <DocHtml html={p.pAi} />

      <h2>{p.hMetrics}</h2>
      <DocHtml html={p.pMetrics} />

      <h2>{p.hSuggest}</h2>
      <DocHtml html={p.pSuggest} />

      <h2>{p.hApi}</h2>
      <DocHtml html={p.pApi} />
    </>
  );
}
