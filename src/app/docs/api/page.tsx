import { DocHtml } from '@/components/docs/DocHtml';
import { docsPageMetadata } from '@/lib/i18n/docsMeta';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { IconArrowRight } from '@/components/icons/Arrows';
import { allowPrices } from '@/lib/allowPrices';

export async function generateMetadata() {
  return docsPageMetadata('api');
}

export default async function DocsApiPage() {
  const p = getDictionary(await getLocaleFromCookie()).docs.pages.api;
  const rows = allowPrices ? p.rows : p.rows.filter((r) => r.path !== '/api/billing/status');

  return (
    <>
      <h1>{p.title}</h1>
      <DocHtml html={p.p1} />

      <h2>{p.hCliente}</h2>
      <DocHtml html={p.pClient} />

      <h2>{p.hRest}</h2>
      <DocHtml html={p.pRest} />
      <table>
        <thead>
          <tr>
            <th>{p.thMethod}</th>
            <th>{p.thPath}</th>
            <th>{p.thUse}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.path}>
              <td>
                <code>{row.method}</code>
              </td>
              <td>
                <code>{row.path}</code>
              </td>
              <td style={row.path === '/api/operations/dependency-graph' ? { verticalAlign: 'middle' } : undefined}>
                {row.path === '/api/operations/dependency-graph' ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {row.use.split('→')[0]?.trim()}{' '}
                    <IconArrowRight size={12} /> {row.use.includes('→') ? row.use.split('→')[1]?.trim() : ''}
                  </span>
                ) : (
                  row.use
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{p.hWebhook}</h2>
      <table>
        <thead>
          <tr>
            <th>{p.thMethod}</th>
            <th>{p.thPath}</th>
            <th>{p.thUse}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/webhook/:tenantId/:slug</code>
            </td>
            <td>{p.pWebhookIngest}</td>
          </tr>
        </tbody>
      </table>

      <h2>{p.hCors}</h2>
      <DocHtml html={p.pCors} />
    </>
  );
}
