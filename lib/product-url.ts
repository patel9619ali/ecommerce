type ProductRouteInput = {
  slug?: string | null;
  brandSlug?: string | null;
  categorySlug?: string | null;
};

const slugifySegment = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function toRouteSegment(value?: string | null): string | null {
  if (!value) return null;
  const segment = slugifySegment(value);
  return segment || null;
}

export function buildProductPath({
  slug,
  brandSlug,
  categorySlug,
}: ProductRouteInput): string {
  const productSlug = toRouteSegment(slug);
  const brand = toRouteSegment(brandSlug);
  const category = toRouteSegment(categorySlug);

  if (!productSlug) return "/products";

  if (brand && category) {
    return `/product/${brand}/${category}/${productSlug}`;
  }

  // Backward-compatible fallback for legacy cart/wishlist rows.
  return `/product/${productSlug}`;
}

export function buildProductPathWithVariant(
  input: ProductRouteInput,
  variant?: string | null
): string {
  const path = buildProductPath(input);
  if (!variant) return path;
  return `${path}?variant=${encodeURIComponent(variant)}`;
}

export function isPortableJuicerCategory(category?: string | null): boolean {
  const value = (category || "").toLowerCase();
  return value.includes("portable") && value.includes("juicer");
}
