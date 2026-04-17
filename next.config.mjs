/** @type {import('next').NextConfig} */
const vercelHost = process.env.VERCEL_URL;
const allowedOrigins = ['localhost:3000', ...(vercelHost ? [vercelHost] : [])];

/** Destino del proxy `/worker-api/*` → Worker (misma ruta). Evita CORS y mixed content en el navegador. */
function backendProxyTarget() {
  const raw =
    process.env.BACKEND_PROXY_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'http://127.0.0.1:8787';
  return raw.replace(/\/$/, '');
}

const nextConfig = {
  env: {
    // ALLOW_PRICES en el dashboard de despliegue se expone al cliente como NEXT_PUBLIC_ALLOW_PRICES
    NEXT_PUBLIC_ALLOW_PRICES: process.env.NEXT_PUBLIC_ALLOW_PRICES ?? process.env.ALLOW_PRICES ?? 'false',
  },
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  async rewrites() {
    return [
      {
        source: '/worker-api/:path*',
        destination: `${backendProxyTarget()}/:path*`,
      },
    ];
  },
};

export default nextConfig;
