import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('intro');
}

export default async function DocsIntroPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.intro;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hWhat}</h2>
      <ul>
        {p.liWhat.map((html, i) => (
          <li key={i}>
            <DocHtml html={html} as="span" />
          </li>
        ))}
      </ul>

      <h2>{p.hFlow}</h2>
      <ol>
        {p.liFlow.map((html, i) => (
          <li key={i}>
            <DocHtml html={html} as="span" />
          </li>
        ))}
      </ol>

      <h2>{p.hStack}</h2>
      <DocHtml html={p.pStack} />
    </>
  );
}
