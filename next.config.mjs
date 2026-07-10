// Response security headers applied to every route. All four are "safe" —
// they restrict capabilities the site never uses, so nothing here can break
// rendering. Deliberately NO Content-Security-Policy: a strict CSP would need
// to allowlist the Vercel Analytics script + Framer/anime inline styles, and
// is a separate, carefully-tested change.
const securityHeaders = [
  // Block third-party sites from embedding this in an iframe (clickjacking).
  // SAMEORIGIN, not DENY, so Vercel's own preview tooling can still frame it.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop browsers from MIME-sniffing a response into a different type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin (not the full URL) on cross-origin requests.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Turn off powerful APIs the site does not use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
