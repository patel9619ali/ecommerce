import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ TypeScript now knows userId is a string
    const userId = session.user.id;

    const { items } = await request.json();

    await db.$transaction(async (tx) => {
      // ✅ Upsert wishlist with proper typing
      const wishlist = await tx.wishlist.upsert({
        where: { userId },
        update: {},
        create: { userId }, // ✅ No more type error
      });

      // Delete items not in the sync payload
      if (items.length === 0) {
        // If no items, delete all wishlist items
        await tx.wishlistItem.deleteMany({
          where: { wishlistId: wishlist.id },
        });
      } else {
        // Delete items not in the current sync payload
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