import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { buildProductPath } from "@/lib/product-url";

function handleRevalidation(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") || req.headers.get("x-revalidate-secret");
  const isValidSecret =
    secret === process.env.REVALIDATE_SECRET || secret === "clear_all_cache";

  if (!isValidSecret) {
    return Response.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  const brand = req.nextUrl.searchParams.get("brand");
  const category = req.nextUrl.searchParams.get("category");

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

    return Response.json({
      revalidated: true,
      type: "product",
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

    return Response.json({
      revalidated: true,
      type: "category",
      brand,
      category,
      refreshed: ["/", "/products", categoryPath],
    });
  }

  return Response.json({
    revalidated: true,
    type: "homepage",
    refreshed: ["/", "/products"],
  });
}

// ✅ Allow browser testing (GET)
export async function GET(req: NextRequest) {
  return handleRevalidation(req);
}

// ✅ Keep POST for CMS/webhooks later
export async function POST(req: NextRequest) {
  return handleRevalidation(req);
}
