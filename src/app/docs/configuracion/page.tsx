import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('configuracion');
}

export default async function DocsConfiguracionPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.configuracion;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hAccount}</h2>
      <DocHtml html={p.pAccount} />

      <h2>{p.hNotif}</h2>
      <DocHtml html={p.pNotif} />

      <h2>{p.hInfra}</h2>
      <DocHtml html={p.pInfra} />

      <h2>{p.hEnv}</h2>
      <DocHtml html={p.pEnv} />
    </>
  );
}
