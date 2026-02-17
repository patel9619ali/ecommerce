import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

function handleRevalidation(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (slug) {
    revalidateTag(`product-${slug}`, "max");

    return Response.json({
      revalidated: true,
      type: "product",
      slug,
    });
  }

  revalidateTag("homepage-products", "max");

  return Response.json({
    revalidated: true,
    type: "homepage",
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