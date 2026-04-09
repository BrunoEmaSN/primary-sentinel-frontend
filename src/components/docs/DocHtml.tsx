type Tag = 'p' | 'div' | 'span' | 'li';

/** HTML estático del diccionario (solo contenido propio). */
export function DocHtml({ html, as: Comp = 'p' }: { html: string; as?: Tag }) {
  return <Comp dangerouslySetInnerHTML={{ __html: html }} />;
}
