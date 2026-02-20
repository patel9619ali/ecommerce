import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const slug = body?.entry?.slug;

  if (!slug) {
    return NextResponse.json({ error: "No slug found" }, { status: 400 });
  }

  revalidateTag(`product-${slug}`, "max"); // ✅ REQUIRED in your version
  revalidateTag("homepage-products", "max"); // ✅ also revalidate listing

  return NextResponse.json({ revalidated: true });
}