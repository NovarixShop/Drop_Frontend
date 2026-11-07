"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { isOptimizableImage } from "@/lib/imageHosts";

type ProductImageProps = Omit<ImageProps, "src"> & { src?: string | null };

/**
 * next/image for product photos, which can come from our own uploads or any URL an admin pasted.
 * - Optimizes only allow-listed hosts (see lib/imageHosts.ts); other URLs load directly in the browser.
 * - Shows a neutral placeholder instead of a broken-image icon when the URL is missing or fails.
 */
export default function ProductImage({ src, alt, className, ...rest }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt || "Image unavailable"}
        className="absolute inset-0 flex items-center justify-center bg-surface-container-low text-on-surface-variant/40"
      >
        <ImageOff size={28} />
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      className={className}
      unoptimized={!isOptimizableImage(src)}
      onError={() => setFailedSrc(src)}
    />
  );
}
