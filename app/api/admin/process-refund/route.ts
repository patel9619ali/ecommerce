import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, action = "approve" } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.refundStatus !== "REQUESTED") {
      return NextResponse.json(
        { error: "Only requested refunds can be processed" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      const updated = await db.order.update({
        where: { id: orderId },
        data: { refundStatus: "FAILED" },
      });

      return NextResponse.json({
        success: true,
        message: "Refund request rejected",
        order: updated,
      });
    }

    if (!order.razorpayPaymentId) {
      return NextResponse.json(
        { error: "No Razorpay payment found for this order" },
        { status: 400 }
      );
    }

    await db.order.update({
      where: { id: orderId },
      data: { refundStatus: "PROCESSED" },
    });

    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: (order.refundAmount ?? order.amount) * 100,
      notes: {
        orderId: order.id,
      },
    });

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        refundStatus: "COMPLETED",
        refundId: refund.id,
        status: order.status === "CANCELLED" ? "CANCELLED" : "REFUNDED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Refund processed successfully",
      order: updated,
    });
  } catch (error: any) {
    console.error("Process refund error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process refund" },
      { status: 500 }
    );
  }
}
