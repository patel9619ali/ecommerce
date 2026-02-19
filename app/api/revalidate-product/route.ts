import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  revalidatePath(`product-${slug}`);

  return NextResponse.json({ revalidated: true });
}