import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { allowPrices } from '@/lib/allowPrices';

export async function generateMetadata() {
  return docsPageMetadata('intro');
}

export default async function DocsIntroPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.intro;
  const liFlow = allowPrices ? p.liFlow : p.liFlowNoPrices;
  const pStack = allowPrices ? p.pStack : p.pStackNoPrices;

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
        {liFlow.map((html, i) => (
          <li key={i}>
            <DocHtml html={html} as="span" />
          </li>
        ))}
      </ol>

      <h2>{p.hStack}</h2>
      <DocHtml html={pStack} />
    </>
  );
}
