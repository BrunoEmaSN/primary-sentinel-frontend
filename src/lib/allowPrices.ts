/**
 * Muestra precios en landing, enlaces a #pricing y detalle de tarifas en facturación.
 * Definí `ALLOW_PRICES=true` o `NEXT_PUBLIC_ALLOW_PRICES=true` en el entorno de build o CI.
 */
export const allowPrices = process.env.NEXT_PUBLIC_ALLOW_PRICES === 'true';
