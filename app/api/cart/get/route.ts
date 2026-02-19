// app/api/cart/get/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ cart: null }, { status: 200 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: null }, { status: 200 });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Cart get error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}