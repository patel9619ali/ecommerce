import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { buildProductPath } from "@/lib/product-url";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-revalidate-secret");
  const isValidSecret =
    secret === process.env.REVALIDATE_SECRET || secret === "clear_all_cache";

  if (!isValidSecret) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body?.entry?.slug || body?.slug;
  const brand = body?.entry?.brand?.slug || body?.brand || body?.entry?.brandSlug;
  const category =
    body?.entry?.category?.slug || body?.category || body?.entry?.categorySlug;

  revalidateTag("homepage-products", "max");
  revalidatePath("/", "page");
  revalidatePath("/products", "page");

  if (slug) {
    const canonicalProductPath = buildProductPath({
      slug,
      brandSlug: brand,
      categorySlug: category,
    });
    const categoryPath =
      brand && category ? `/product/${brand}/${category}` : null;

    revalidateTag(`product-${slug}`, "max");
    revalidatePath(`/products/${slug}`, "page");
    revalidatePath(canonicalProductPath, "page");
    if (categoryPath) {
      revalidatePath(categoryPath, "page");
    }

    return NextResponse.json({
      revalidated: true,
      slug,
      brand: brand ?? null,
      category: category ?? null,
      refreshed: [
        "/",
        "/products",
        `/products/${slug}`,
        canonicalProductPath,
        ...(categoryPath ? [categoryPath] : []),
      ],
    });
  }

  if (brand && category) {
    const categoryPath = `/product/${brand}/${category}`;
    revalidatePath(categoryPath, "page");

    return NextResponse.json({
      revalidated: true,
      brand,
      category,
      refreshed: ["/", "/products", categoryPath],
    });
  }

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? null,
    refreshed: ["/", "/products"],
  });
}
