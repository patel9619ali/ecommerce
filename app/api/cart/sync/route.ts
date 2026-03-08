import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

type SyncCartItem = {
  productId: string;
  variantKey: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug?: string | null;
};

export async function POST(req: Request) {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, version } = await req.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ success: true });
  }
  const safeItems = items as SyncCartItem[];

  await db.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { userId },
      create: { userId, syncVersion: 0 },
      update: {},
    });

    const incomingVersion =
      typeof version === "number" && Number.isFinite(version)
        ? Math.floor(version)
        : cart.syncVersion + 1;

    // Ignore stale writes when requests complete out of order.
    if (incomingVersion < cart.syncVersion) {
      return;
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        NOT: safeItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantKey,
        })),
      },
    });

    for (const item of safeItems) {
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

    await tx.cart.update({
      where: { id: cart.id },
      data: { syncVersion: incomingVersion },
    });
  });

  return NextResponse.json({ success: true });
}
