import type { NextConfig } from "next";

const ONE_DAY = 86_400;
const ONE_WEEK = 7 * ONE_DAY;

const WORDPRESS = "https://blog.agenciadigital.com.vc";

// Content-Security-Policy. Origins come from what the site and the blog
// content actually load (Vimeo hero, YouTube modal/embeds, LinkedIn embed,
// Giphy GIFs and WordPress uploads in posts).
//
// `script-src 'unsafe-inline'`: Next.js streams page data through inline
// <script> tags. A nonce would remove it but forces every page to render
// per request (no static/ISR), which costs far more than it buys here.
// Scripts from any other origin, plugins, <base> hijacking, foreign form
// targets and framing by other sites are all blocked.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${WORDPRESS} https://i.ytimg.com https://img.youtube.com https://i.giphy.com https://media.giphy.com`,
  "font-src 'self'",
  `media-src 'self' ${WORDPRESS}`,
  "frame-src https://player.vimeo.com https://www.youtube-nocookie.com https://www.youtube.com https://www.linkedin.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Baseline hardening for every response.
const SECURITY_HEADERS = [
  // Dev mode needs eval and a websocket for HMR — enforce CSP in production.
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: CSP }]
    : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first (~20–30% smaller than WebP), WebP as fallback.
    formats: ["image/avif", "image/webp"],
    // Next 16 only honours qualities listed here (default: [75]) and
    // silently rounds anything else — the quality={60|65} props used for
    // decorative backgrounds and logos had no effect until now.
    qualities: [60, 65, 75],
    minimumCacheTTL: 2_678_400,
    remotePatterns: [
      new URL("https://blog.agenciadigital.com.vc/wp-content/uploads/**"),
      // Video thumbnails on /trabalhos and the home page.
      new URL("https://i.ytimg.com/vi/**"),
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Files in /public aren't fingerprinted, so they default to
      // `max-age=0`. Cache them for a while and revalidate in the background.
      {
        source: "/:file*.:ext(svg|png|jpg|jpeg|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`,
          },
        ],
      },
      {
        source: "/storage/:file*.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
