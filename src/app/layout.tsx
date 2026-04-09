import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import SentinelChat from '@/components/SentinelChat';

export const metadata: Metadata = {
  title: 'Primary Sentinel — Autonomous Reliability & Security Intelligence',
  description:
    'Autonomous reliability and security intelligence for ingestion, workloads, and destinations — monitor, repair, and govern with AI.',
  icons: {
    icon: '/logo.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocaleFromCookie();
  const dictionary = getDictionary(locale);
  const sentinelChatWorkerUrl = process.env.NEXT_PUBLIC_SENTINEL_CHAT_WORKER_URL?.trim() ?? '';

  return (
    <html lang={locale}>
      <body>
        <I18nProvider initialLocale={locale} dictionary={dictionary}>
          {children}
          {sentinelChatWorkerUrl !== '' ? (
            <SentinelChat workerUrl={sentinelChatWorkerUrl} position="bottom-right" />
          ) : null}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
