// Builds the storefront URL for a product detail page.
//
// Returns `null` when the product carries no usable slug, so callers can render plain
// markup instead of a link to `/products/undefined` (which renders the detail page and
// then fails its API lookup, showing a misleading "Product not found").
//
// A slug must also stay a SINGLE path segment. `/products/[slug]` matches one segment
// only, so a stray "/" in legacy or imported data produces `/products/a/b`, which
// matches no route at all and renders Next.js's bare 404 page. Percent-encoding keeps
// such a slug addressable; `useParams()` decodes it back before the API call.
export const productHref = (slug?: string | null): string | null => {
  const trimmed = (slug ?? "").trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
  return `/products/${encodeURIComponent(trimmed)}`;
};
