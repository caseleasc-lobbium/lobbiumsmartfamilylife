/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Netlify benötigt serverless Output, KEIN Static Export
  output: "standalone",

  trailingSlash: true,

  images: {
    unoptimized: true,
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