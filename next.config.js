/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ❗ WICHTIG: Vercel braucht KEIN "output"
  // ❗ KEINE static export, KEIN standalone, KEIN trailingSlash

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