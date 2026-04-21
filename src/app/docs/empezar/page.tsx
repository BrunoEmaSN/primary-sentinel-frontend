import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { allowPrices } from '@/lib/allowPrices';

export async function generateMetadata() {
  return docsPageMetadata('empezar');
}

export default async function DocsEmpezarPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.empezar;
  const pExplore = allowPrices ? p.pExplore : p.pExploreNoPrices;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hExplore}</h2>
      <DocHtml html={pExplore} />

      <h2>{p.hSignIn}</h2>
      <DocHtml html={p.pAuth} />
      <DocHtml html={p.pAuthHelp} />

      <h2>{p.hSupport}</h2>
      <DocHtml html={p.pSupport} />
    </>
  );
}
