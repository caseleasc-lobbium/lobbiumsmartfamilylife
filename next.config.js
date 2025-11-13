/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // WICHTIG: Für Vercel NICHTS setzen wie "output", "trailingSlash", "export"
  images: {
    unoptimized: false,
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },

  async headers() {
    return [];
  },

  async redirects() {
    return [];
  },
};

module.exports = nextConfig;