/**
 * Con `true`: precios en landing, enlaces a #pricing, `/dashboard/billing`, guía `/docs/facturación` y enlaces de compra/planes.
 * Con `false`: se ocultan precios, facturación y compras en el front (redirecciones y navegación acotadas).
 * Definí `ALLOW_PRICES=true` o `NEXT_PUBLIC_ALLOW_PRICES=true` en el entorno de build o CI.
 */
export const allowPrices = process.env.NEXT_PUBLIC_ALLOW_PRICES === 'true';
