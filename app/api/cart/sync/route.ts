import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ success: true });
  }

  await db.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { userId },
      create: { userId }, // ✅ now strictly string
      update: {},
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        NOT: items.map((i: any) => ({
          productId: i.productId,
          variantId: i.variantKey,
        })),
      },
    });

    for (const item of items) {
      await tx.cartItem.upsert({
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
          slug: item.slug ?? null,
        },
        update: {
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          title: item.title,
          slug: item.slug ?? null,
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}

