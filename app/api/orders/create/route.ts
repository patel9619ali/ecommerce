import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total, paymentMethod } = await request.json();

    // ✅ Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!total || typeof total !== "number") {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    // ✅ Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // ✅ Create order in database
    const order = await db.order.create({
      data: {
        id: orderId,
        userId: session.user.id,
        amount: Math.round(total),
        status: paymentMethod === "cod" ? "pending" : "processing",
        createdAt: new Date(),
      },
    });

    // ✅ Create order items WITH IMAGES
    await Promise.all(
      items.map((item: any) =>
        db.orderItem.create({
          data: {
            id: `${orderId}-${item.productId}-${item.variantKey}`,
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantKey,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "", // ✅  Include image
          },
        })
      )
    );

    // ✅ Fetch complete order with items
    const fullOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: fullOrder, // ✅ Return full order with items
    });
  } catch (error: any) {
    console.error("Order creation error:", error);

    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// ✅ GET route to fetch user's orders
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
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