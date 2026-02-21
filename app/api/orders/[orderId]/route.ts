import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // ✅ Run in parallel, never let auth crash the route
    const [order, session] = await Promise.all([
      db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      }),
      auth().catch(() => null), // ✅ Auth failure never crashes this
    ]);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session?.user?.id && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("❌ Fetch order error:", {
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: error?.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}