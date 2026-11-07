"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { api } from "@/lib/api";
import ProductImage from "@/components/products/ProductImage";
import { productHref } from "@/lib/productHref";

interface SimilarProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  stock: number;
  averageRating?: number;
  totalReviews?: number;
}

interface SimilarProductsProps {
  productId: string;
  categoryName?: string | null;
  categorySlug?: string | null;
}

/**
 * "Similar products" row shown under the product details, like the "Customers also viewed" strip on big
 * marketplaces. Products come from the same category (topped up from related categories on the server).
 * The request is only made when the section scrolls near the viewport.
 */
export default function SimilarProducts({ productId, categoryName, categorySlug }: SimilarProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<SimilarProduct[] | null>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // Start loading once the section is within ~400px of the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    api
      .get(`/products/${productId}/similar`, { params: { limit: 12 } })
      .then((res) => {
        if (!cancelled) setProducts(res.data.data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [visible, productId]);

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScroll({
      left: track.scrollLeft > 4,
      right: track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [products]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  // Nothing related to show: hide the section entirely
  if (products && products.length === 0) return <section ref={sectionRef} aria-hidden="true" />;

  return (
    <section ref={sectionRef} className="mt-20" aria-labelledby="similar-products-heading">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="similar-products-heading" className="font-headline-lg text-on-surface">
            Similar products
          </h2>
          {categoryName && (
            <p className="text-on-surface-variant font-caption mt-1">More from {categoryName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {categorySlug && (
            <Link
              href={`/products?category=${encodeURIComponent(categorySlug)}`}
              className="text-primary font-label-md hover:underline mr-2 whitespace-nowrap"
            >
              See all
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScroll.left}
            aria-label="Scroll similar products left"
            className="hidden sm:flex w-10 h-10 rounded-full border border-outline-variant items-center justify-center text-on-surface hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScroll.right}
            aria-label="Scroll similar products right"
            className="hidden sm:flex w-10 h-10 rounded-full border border-outline-variant items-center justify-center text-on-surface hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products === null
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-40 sm:w-52 shrink-0 animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-surface-container-low mb-3" />
                <div className="h-4 w-3/4 rounded bg-surface-container-low mb-2" />
                <div className="h-4 w-1/3 rounded bg-surface-container-low" />
              </div>
            ))
          : products.map((p) => {
              const discount =
                p.compareAtPrice && p.compareAtPrice > p.price
                  ? Math.round((1 - p.price / p.compareAtPrice) * 100)
                  : 0;
              return (
                <Link
                  key={p._id}
                  href={productHref(p.slug) ?? "/products"}
                  className="group w-40 sm:w-52 shrink-0 snap-start"
                >
                  <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-surface-container-low soft-shadow mb-3">
                    <ProductImage
                      src={p.images?.[0]}
                      alt={p.name}
                      fill
                      sizes="208px"
                      className={`object-cover transition-all duration-500 ${
                        p.images?.[1] ? "group-hover:opacity-0" : "group-hover:scale-105"
                      }`}
                    />
                    {/* Second photo fades in on hover */}
                    {p.images?.[1] && (
                      <ProductImage
                        src={p.images[1]}
                        alt=""
                        fill
                        sizes="208px"
                        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                    {p.stock === 0 && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <p className="font-body-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </p>
                  {!!p.totalReviews && (
                    <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-caption">
                      <Star size={12} className="text-amber-400" fill="currentColor" />
                      {(p.averageRating || 0).toFixed(1)} ({p.totalReviews})
                    </div>
                  )}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-[#00C853]">₹{p.price.toFixed(2)}</span>
                    {discount > 0 && (
                      <span className="text-xs text-on-surface-variant line-through opacity-60">
                        ₹{p.compareAtPrice!.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
