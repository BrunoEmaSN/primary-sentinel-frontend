/** @type {import('next').NextConfig} */
const vercelHost = process.env.VERCEL_URL;
const allowedOrigins = ['localhost:3000', ...(vercelHost ? [vercelHost] : [])];

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
};

export default nextConfig;
