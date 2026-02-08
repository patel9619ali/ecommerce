// app/api/cart/sync/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    // ✅ Let Prisma handle cart.id
    const cart = await db.cart.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
      },
      update: {},
    });

    // ✅ Sync items (safe)
    for (const item of items) {
await db.cartItem.upsert({
  where: {
    cartId_productId_variantId: {
      cartId: cart.id,
      productId: item.productId,
      variantId: item.variantKey,
    },
  },
  create: {
    id: crypto.randomUUID(),
    cartId: cart.id,
    productId: item.productId,
    variantId: item.variantKey,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    slug: item.slug,
  },
  update: {
    quantity: item.quantity,
    price: item.price,
    image: item.image,
    slug: item.slug,
  },
});

    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
