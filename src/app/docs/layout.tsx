import type { Metadata } from 'next';
import DocsNav from '@/components/docs/DocsNav';

export const metadata: Metadata = {
  title: {
    default: 'Documentación',
    template: '%s — Primary Sentinel',
  },
  description:
    'Guía de uso de Primary Sentinel: dashboard, flujos, reglas IA, Dead Letter, notificaciones, configuración e integración con la API.',
  openGraph: {
    title: 'Documentación — Primary Sentinel',
    description:
      'Guía de uso de Primary Sentinel: monitorización, auto-reparación con IA e integración con tu backend.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentación — Primary Sentinel',
    description:
      'Guía de uso de Primary Sentinel: monitorización, auto-reparación con IA e integración con tu backend.',
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
