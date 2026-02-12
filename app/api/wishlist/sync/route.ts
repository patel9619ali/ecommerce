import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();

    await db.$transaction(async (tx) => {
      // Upsert wishlist
      const wishlist = await tx.wishlist.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id },
      });

      // Delete items not in the sync payload
      const itemIds = items.map((i: any) => `${i.productId}-${i.variantId}`);
      await tx.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          NOT: {
            OR: items.map((i: any) => ({
              productId: i.productId,
              variantId: i.variantId,
            })),
          },
        },
      });

      // Upsert each item
      for (const item of items) {
        await tx.wishlistItem.upsert({
          where: {
            wishlistId_productId_variantId: {
              wishlistId: wishlist.id,
              productId: item.productId,
              variantId: item.variantId,
            },
          },
          update: {
            slug: item.slug,
            title: item.title,
            price: item.price,
            mrp: item.mrp,
            image: item.image,
            colorName: item.colorName,
            colorHex: item.colorHex,
          },
          create: {
            wishlistId: wishlist.id,
            productId: item.productId,
            variantId: item.variantId,
            slug: item.slug,
            title: item.title,
            price: item.price,
            mrp: item.mrp,
            image: item.image,
            colorName: item.colorName,
            colorHex: item.colorHex,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing wishlist:", error);
    return NextResponse.json(
      { error: "Failed to sync wishlist" },
      { status: 500 }
    );
  }
}