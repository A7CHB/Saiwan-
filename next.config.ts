import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // AVIF first, WebP second — both are far smaller than the JPEGs a
    // photography-led site would otherwise ship.
    formats: ["image/avif", "image/webp"],
    // Matches the layout's real breakpoints so we never generate unused sizes.
    deviceSizes: [400, 640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Next 16 requires every quality used in the app to be declared.
    qualities: [75, 82, 88, 90],
    remotePatterns: [
      // Where the dashboard's uploads land in production. Every store gets its
      // own subdomain, so the wildcard is the store, not an open door.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Seed photography. Replace with the Saiwan asset host when real shots
      // exist for everything.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // The admin is never a search result and never framed.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Legacy/unprefixed entry points people type by hand.
      { source: "/collection", destination: "/en/collection", permanent: false },
      { source: "/contact", destination: "/en/contact", permanent: false },
      { source: "/about", destination: "/en/about", permanent: false },
    ];
  },
};

export default nextConfig;
