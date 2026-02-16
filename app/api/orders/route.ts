import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Fetch all orders for the current user, sorted by newest first
    const orders = await db.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true, // Include order items
      },
      orderBy: {
        createdAt: "desc", // Newest orders first
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}