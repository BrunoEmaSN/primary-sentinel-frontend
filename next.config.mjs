/** @type {import('next').NextConfig} */
const vercelHost = process.env.VERCEL_URL;
const allowedOrigins = ['localhost:3000', ...(vercelHost ? [vercelHost] : [])];

/** Destino del proxy `/worker-api/*` → Worker (misma ruta). Evita CORS y mixed content en el navegador. */
function backendProxyTarget() {
  const raw =
    process.env.BACKEND_PROXY_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'http://127.0.0.1:8787';
  let base = raw.replace(/\/$/, '');
  // Si la env termina en `/worker-api`, el rewrite `/worker-api/:path*` → `${base}/:path*` envía
  // `/worker-api/api/...` al Worker y las rutas reales (`/api/...`) devuelven 404.
  if (base.endsWith('/worker-api')) {
    base = base.slice(0, -'/worker-api'.length);
  }
  return base.replace(/\/$/, '');
}

function stripTrailingSlash(s) {
  return s.replace(/\/$/, '');
}

function sentinelChatProxyTarget() {
  const raw =
    process.env.BACKEND_CHAT_PROXY_URL?.trim() ||
    process.env.NEXT_PUBLIC_SENTINEL_CHAT_WORKER_URL?.trim() ||
    '';
  if (!raw) return '';
  let base = stripTrailingSlash(raw);
  if (base.endsWith('/worker-api-chat')) {
    base = base.slice(0, -'/worker-api-chat'.length);
  }
  return stripTrailingSlash(base);
}

function sentinelSalesProxyTarget() {
  const raw =
    process.env.BACKEND_SALES_PROXY_URL?.trim() ||
    process.env.NEXT_PUBLIC_SENTINEL_SALES_WORKER_URL?.trim() ||
    '';
  if (!raw) return '';
  let base = stripTrailingSlash(raw);
  if (base.endsWith('/worker-api-sales')) {
    base = base.slice(0, -'/worker-api-sales'.length);
  }
  return stripTrailingSlash(base);
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
    const list = [
      {
        source: '/worker-api/:path*',
        destination: `${backendProxyTarget()}/:path*`,
      },
    ];
    const chatDest = sentinelChatProxyTarget();
    if (chatDest) {
      list.push({
        source: '/worker-api-chat/:path*',
        destination: `${chatDest}/:path*`,
      });
    }
    const salesDest = sentinelSalesProxyTarget();
    if (salesDest) {
      list.push({
        source: '/worker-api-sales/:path*',
        destination: `${salesDest}/:path*`,
      });
    }
    return list;
  },
  // CSP: nonces + enforcing en prod vía `src/proxy.ts` y `src/lib/contentSecurityPolicy.ts`.
};

export default nextConfig;
