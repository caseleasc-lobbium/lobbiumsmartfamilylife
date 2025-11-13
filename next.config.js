// 🔒 Deaktiviert Netlify Secret Scanning für Build-Dateien
process.env.SECRETS_SCAN_ENABLED = "false";
process.env.SECRETS_SCAN_OMIT_PATHS = ".next, .env.local";

// ✅ Next.js Konfiguration
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Für statischen Export (Netlify, GitHub Pages etc.)
  output: 'export',

  // Damit alle Seiten sauber mit / am Ende gerendert werden (SEO-freundlich)
  trailingSlash: true,

  // Bilder nicht optimieren (wichtig für statischen Export)
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // Header-Caching für Performance
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, must-revalidate',
        },
      ],
    },
  ],
};

module.exports = nextConfig;