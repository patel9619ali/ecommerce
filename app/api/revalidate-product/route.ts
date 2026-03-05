import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body?.entry?.slug || body?.slug;

  revalidateTag("homepage-products", "max");
  revalidatePath("/", "page");
  revalidatePath("/products", "page");

  if (slug) {
    revalidateTag(`product-${slug}`, "max");
    revalidatePath(`/products/${slug}`, "page");
  }

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? null,
    refreshed: slug ? ["/", "/products", `/products/${slug}`] : ["/", "/products"],
  });
}
