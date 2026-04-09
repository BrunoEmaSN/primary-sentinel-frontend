import type { Metadata } from 'next';
import DocsNav from '@/components/docs/DocsNav';

export const metadata: Metadata = {
  title: {
    default: 'Documentación',
    template: '%s — Primary Sentinel',
  },
  description:
    'Guía del producto SaaS Primary Sentinel: cuenta multi-tenant, panel, operaciones, DLQ, planes e integración API.',
  openGraph: {
    title: 'Documentación — Primary Sentinel',
    description:
      'SaaS de observabilidad y auto-reparación de pipelines: documentación para equipos y administradores de tenant.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentación — Primary Sentinel',
    description:
      'SaaS de observabilidad y auto-reparación de pipelines: documentación para equipos y administradores de tenant.',
  },
};

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
