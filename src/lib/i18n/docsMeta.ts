import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import type { Dictionary } from '@/lib/i18n/messages';

type DocsPageKey = keyof Dictionary['docs']['pages'];

export async function docsPageMetadata(page: DocsPageKey): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  const d = getDictionary(locale);
  const p = d.docs.pages[page];
  return {
    title: p.metaTitle,
    description: p.metaDesc,
  };
}
