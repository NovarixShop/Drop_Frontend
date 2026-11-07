import Link from "next/link";
import { Compass, Home, ShoppingBag } from "lucide-react";

// Replaces Next.js's unstyled built-in 404 for any URL that matches no route,
// e.g. /products/<slug-with-a-slash>, which is two segments and so matches
// neither /products nor /products/[slug].
export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="bg-surface-container-low border-outline-variant/40 mb-8 flex h-20 w-20 items-center justify-center rounded-full border">
        <Compass className="text-primary h-9 w-9" aria-hidden />
      </div>

      <p className="font-label-md text-on-surface-variant mb-3 tracking-[0.3em] uppercase">
        Error 404
      </p>
      <h1 className="font-headline-xl text-on-surface mb-4">This page doesn&apos;t exist</h1>
      <p className="text-on-surface-variant font-body-md mb-10 max-w-md text-balance">
        The link may be out of date, or the address might have a typo. Everything else is right
        where you left it.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="bg-primary text-on-primary font-label-md inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 transition-opacity hover:opacity-90 active:scale-95"
        >
          <ShoppingBag size={18} aria-hidden /> Browse products
        </Link>
        <Link
          href="/"
          className="border-outline-variant text-on-surface hover:border-primary hover:text-primary font-label-md inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-4 transition-colors"
        >
          <Home size={18} aria-hidden /> Back home
        </Link>
      </div>
    </div>
  );
}
