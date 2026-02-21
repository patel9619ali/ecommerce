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
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    // ✅ Fetch order and session in parallel for speed
    const [order, session] = await Promise.all([
      db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      }),
      auth().catch(() => null), // ✅ Never let auth failure crash the route
    ]);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ If session exists, verify ownership — if no session, still allow
    // (guest just landed from payment redirect)
    if (session?.user?.id && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    // ✅ Log full error details so Vercel logs show exactly what broke
    console.error("❌ Fetch order error:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    });
    return NextResponse.json(
      { error: error?.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}