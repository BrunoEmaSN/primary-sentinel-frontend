import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('empezar');
}

export default async function DocsEmpezarPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.empezar;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.h1}</h2>
      <DocHtml html={p.pInstall} />
      <pre>
        <code>{p.codeInstall}</code>
      </pre>

      <h2>{p.h2}</h2>
      <DocHtml html={p.pEnv} />
      <pre>
        <code>{p.codeCpEnv}</code>
      </pre>
      <p>{p.pEnvExample}</p>
      <pre>
        <code>{p.codeEnvExample}</code>
      </pre>

      <h2>{p.h3}</h2>
      <pre>
        <code>{p.codeDev}</code>
      </pre>

      <h2>{p.h4}</h2>
      <DocHtml html={p.pAuth} />
      <DocHtml html={p.pAuthFail} />

      <h2>{p.h5}</h2>
      <DocHtml html={p.pProd} />
    </>
  );
}
