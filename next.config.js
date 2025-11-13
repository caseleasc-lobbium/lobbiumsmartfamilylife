/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // FULL SSR für Netlify (wichtig!)
  output: "standalone",

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  // Keine Static-Export Sachen mehr!
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    }
  },

  async redirects() {
    return [];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" }
        ],
      },
    ];
  },
};

module.exports = nextConfig;