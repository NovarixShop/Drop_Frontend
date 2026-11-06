// Hosts whose images go through the Next.js image optimizer (resized, WebP/AVIF, cached).
// Keep in sync with `optimizedImageHosts` in next.config.ts — both read the same env variables.
//
// Any other image URL (e.g. one an admin pasted in the CMS) is still shown, but loaded directly by the
// browser (`unoptimized`). That keeps the optimizer from being usable as an open proxy for arbitrary sites.

const STATIC_HOSTS = ["lh3.googleusercontent.com", "images.unsplash.com"];

const hostOf = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.hostname : null;
  } catch {
    return null;
  }
};

export const optimizedImageHosts: string[] = Array.from(
  new Set(
    [
      ...STATIC_HOSTS,
      hostOf(process.env.NEXT_PUBLIC_API_URL),
      ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS || "").split(",").map((h) => h.trim()),
    ].filter((h): h is string => !!h)
  )
);

/** true when next/image may optimize this src; relative paths (/images/...) are always fine */
export const isOptimizableImage = (src: string): boolean => {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  const host = hostOf(src);
  return host !== null && optimizedImageHosts.includes(host);
};
