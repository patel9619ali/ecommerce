import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

function handleRevalidation(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") || req.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");

  revalidateTag("homepage-products", "max");
  revalidatePath("/", "page");
  revalidatePath("/products", "page");

  if (slug) {
    revalidateTag(`product-${slug}`, "max");
    revalidatePath(`/products/${slug}`, "page");

    return Response.json({
      revalidated: true,
      type: "product",
      slug,
      refreshed: ["/", "/products", `/products/${slug}`],
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
