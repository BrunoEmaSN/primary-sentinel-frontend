import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';

export const metadata: Metadata = {
  title: 'Primary Sentinel — Self-Healing AI Pipeline',
  description: 'Monitor, auto-repair, and manage your data pipelines with AI.',
  icons: {
    icon: '/logo.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocaleFromCookie();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <I18nProvider initialLocale={locale} dictionary={dictionary}>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
