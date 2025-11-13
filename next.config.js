/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ❗ Wichtig: Vercel = KEIN output: "export", KEIN "standalone" nötig
  // Vercel erkennt SSR, API, Middleware automatisch
  trailingSlash: false,

  images: {
    unoptimized: true, // falls du keine Next/Image-Optimierung nutzt
  },

  async redirects() {
    return [];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

module.exports = nextConfig;