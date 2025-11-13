process.env.SECRETS_SCAN_ENABLED = "false";
process.env.SECRETS_SCAN_OMIT_PATHS = ".next, .env.local";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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