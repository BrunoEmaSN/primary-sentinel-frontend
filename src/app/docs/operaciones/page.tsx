import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { IconArrowRight } from '@/components/icons/Arrows';

export async function generateMetadata() {
  return docsPageMetadata('operaciones');
}

export default async function DocsOperacionesPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.operaciones;

  return (
    <>
      <h1>{p.title}</h1>
      <p>
        <DocHtml html={p.p1Before} as="span" />{' '}
        <IconArrowRight size={12} style={{ verticalAlign: 'middle', display: 'inline-block', margin: '0 2px' }} />{' '}
        <DocHtml html={p.p1After} as="span" />
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
