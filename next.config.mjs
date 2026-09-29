// next.config.mjs — güvenlik başlıkları + Vercel deployment uyumlu
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { remotePatterns: [] }, // tüm görseller yerel public/ altından gelir
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
          {
            key: "Content-Security-Policy",
            // FIX: font-src'e Google Fonts CDN eklendi (Fraunces + Inter)
            // FIX: style-src'e fonts.googleapis.com eklendi (@import için)
            // FIX: connect-src'e NextAuth & Vercel live routes eklendi
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob:",
              "media-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
export default nextConfig;
