import { redirect } from 'next/navigation';
import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { allowPrices } from '@/lib/allowPrices';

export async function generateMetadata() {
  return docsPageMetadata('facturacion');
}

export default async function DocsFacturacionPage() {
  if (!allowPrices) {
    redirect('/docs');
  }
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.facturacion;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hScreen}</h2>
      <DocHtml html={p.pScreen} />

      <h2>{p.hFree}</h2>
      <DocHtml html={p.pFree} />

      <h2>{p.hRoadmap}</h2>
      <DocHtml html={p.pRoadmap} />

      <h2>{p.hApi}</h2>
      <DocHtml html={p.pApi} />
    </>
  );
}
