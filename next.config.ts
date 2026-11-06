import type { NextConfig } from "next";

// Hosts whose images the Next.js optimizer may fetch. Keep in sync with src/lib/imageHosts.ts.
// Previously every http/https host was allowed, which let anyone use this server as a free image proxy.
// Images from other hosts still display: <ProductImage> loads them directly in the browser instead.
const httpsHostOf = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.hostname : null;
  } catch {
    return null;
  }
};

const optimizedImageHosts = Array.from(
  new Set(
    [
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      httpsHostOf(process.env.NEXT_PUBLIC_API_URL),
      ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS || "").split(",").map((h) => h.trim()),
    ].filter((h): h is string => !!h)
  )
);

const securityHeaders = [
  // Nobody may frame the store (clickjacking on checkout / account pages)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: optimizedImageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    // Don't follow redirects to hosts that aren't allow-listed
    maximumRedirects: 0,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
