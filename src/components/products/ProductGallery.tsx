"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/products/ProductImage";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

/**
 * Marketplace-style product gallery:
 * - Desktop: vertical thumbnail strip on the left; hovering or clicking a thumbnail switches the main image,
 *   and hovering the main image zooms into the spot under the cursor.
 * - Mobile: swipeable main image (scroll-snap) with dot indicators and a horizontal thumbnail row.
 * - Keyboard: ← / → on the focused gallery move between images.
 * Render it with key={product._id} so a different product starts fresh at its first image.
 */
export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const current = Math.min(active, Math.max(count - 1, 0));

  const go = (index: number) => {
    if (count === 0) return;
    const next = (index + count) % count;
    setActive(next);
    // Keep the mobile swipe track in sync when navigating with buttons/thumbnails
    const track = trackRef.current;
    if (track && track.clientWidth > 0) {
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    }
  };

  if (count === 0) {
    return (
      <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low rounded-2xl soft-shadow flex items-center justify-center text-on-surface-variant/50">
        No Image
      </div>
    );
  }

  return (
    <div
      className="flex flex-col-reverse md:flex-row gap-4 outline-none"
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={`${name} images`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(current + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(current - 1);
        }
      }}
    >
      {/* Thumbnails: row on mobile, column on desktop */}
      {count > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[560px] md:w-20 shrink-0 pb-1 md:pb-0 md:pr-1">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              onClick={() => go(idx)}
              onMouseEnter={() => go(idx)}
              aria-label={`Show image ${idx + 1} of ${count}`}
              aria-current={idx === current}
              className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-surface-container-low transition-all ${
                idx === current ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 min-w-0">
        {/* Desktop: single image with hover zoom */}
        <div
          className="hidden md:block aspect-[4/5] relative overflow-hidden bg-surface-container-low rounded-2xl soft-shadow cursor-zoom-in"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <ProductImage
            key={images[current]}
            src={images[current]}
            alt={`${name} — image ${current + 1} of ${count}`}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-200 ease-out"
            style={
              zoom
                ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : { transform: "scale(1)" }
            }
          />
        </div>

        {/* Mobile: swipeable track */}
        <div
          ref={trackRef}
          className="md:hidden flex overflow-x-auto snap-x snap-mandatory rounded-2xl soft-shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.clientWidth === 0) return;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            if (idx !== current) setActive(idx);
          }}
        >
          {images.map((img, idx) => (
            <div key={img + idx} className="relative w-full shrink-0 snap-center aspect-[4/5] bg-surface-container-low">
              <ProductImage
                src={img}
                alt={`${name} — image ${idx + 1} of ${count}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-on-surface shadow hover:bg-surface transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-on-surface shadow hover:bg-surface transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {current + 1} / {count}
            </span>
            {/* Dots (mobile) */}
            <div className="md:hidden absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${idx === current ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
