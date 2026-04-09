import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata() {
  return docsPageMetadata('dashboard');
}

export default async function DocsDashboardPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.dashboard;

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hMetrics}</h2>
      <DocHtml html={p.pMetrics} />

      <h2>{p.hDiagram}</h2>
      <DocHtml html={p.pDiagram} />

      <h2>{p.hRecent}</h2>
      <DocHtml html={p.pRecent} />

      <h2>{p.hActivity}</h2>
      <DocHtml html={p.pActivity} />
    </>
  );
}
