import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { allowPrices } from '@/lib/allowPrices';

export async function generateMetadata() {
  return docsPageMetadata('configuracion');
}

export default async function DocsConfiguracionPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.configuracion;
  const pAccount = allowPrices ? p.pAccount : p.pAccountNoPrices;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hAccount}</h2>
      <DocHtml html={pAccount} />

      <h2>{p.hNotif}</h2>
      <DocHtml html={p.pNotif} />

      <h2>{p.hInfra}</h2>
      <DocHtml html={p.pInfra} />
    </>
  );
}
