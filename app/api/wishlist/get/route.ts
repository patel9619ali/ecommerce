import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProductBySlug } from "@/lib/api";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ wishlist: null });
    }

    // ✅ TypeScript now knows userId is a string
    const userId = session.user.id;

    const wishlist = await db.wishlist.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!wishlist) {
      return NextResponse.json({ wishlist: null });
    }

    const items = await Promise.all(
      wishlist.items.map(async (item) => {
        if (item.brandSlug && item.categorySlug) {
          return item;
        }

        const product = await getProductBySlug(item.slug);

        return {
          ...item,
          brandSlug: item.brandSlug || product?.brand?.slug || product?.brand?.name || null,
          categorySlug:
            item.categorySlug || product?.category?.slug || product?.category?.name || null,
        };
      })
    );

    return NextResponse.json({
      wishlist: {
        ...wishlist,
        items,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
