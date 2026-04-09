import type { Metadata } from 'next';
import DocsNav from '@/components/docs/DocsNav';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocaleFromCookie());
  const d = dict.docs;
  return {
    title: {
      default: d.layoutTitle,
      template: '%s — Primary Sentinel',
    },
    description: d.layoutDescription,
    openGraph: {
      title: d.layoutOgTitle,
      description: d.layoutOgDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: d.layoutOgTitle,
      description: d.layoutOgDescription,
    },
  };
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-root">
      <DocsNav />
      <div className="docs-main">
        <article className="docs-prose fade-up">{children}</article>
      </div>
    </div>
  );
}
