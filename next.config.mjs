/** @type {import('next').NextConfig} */
const vercelHost = process.env.VERCEL_URL;
const allowedOrigins = ['localhost:3000', ...(vercelHost ? [vercelHost] : [])];

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
