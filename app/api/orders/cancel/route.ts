import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const CANCELLABLE_STATUSES = new Set(["PENDING", "PROCESSING"]);

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, reason, refundToWallet = true } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!CANCELLABLE_STATUSES.has(order.status)) {
      return NextResponse.json(
        { error: "Order can no longer be cancelled" },
        { status: 400 }
      );
    }

    if (order.status === "CANCELLED") {
      return NextResponse.json({ error: "Order already cancelled" }, { status: 400 });
    }

    if (order.paymentMethod === "COD") {
      const updated = await db.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
          cancellationReason: reason || "Cancelled by user",
          cancelledAt: new Date(),
        },
      });
      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully",
        order: updated,
      });
    }

    if (order.paymentMethod === "WALLET" && !refundToWallet) {
      return NextResponse.json(
        { error: "Wallet-paid orders can only be refunded to wallet" },
        { status: 400 }
      );
    }

    if (refundToWallet) {
      const updated = await db.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { increment: order.amount } },
        });

        await tx.walletTransaction.create({
          data: {
            userId,
            orderId: order.id,
            type: "CREDIT",
            amount: order.amount,
            reason: "Cancellation refund credited to wallet",
          },
        });

        return tx.order.update({
          where: { id: orderId },
          data: {
            status: "CANCELLED",
            cancellationReason: reason || "Cancelled by user",
            cancelledAt: new Date(),
            refundStatus: "COMPLETED",
            refundDestination: "WALLET",
            refundReason: reason || "Cancellation refund",
            refundAmount: order.amount,
            refundId: `WALLET-CANCEL-${Date.now()}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Order cancelled and refunded to wallet instantly",
        order: updated,
      });
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancellationReason: reason || "Cancelled by user",
        cancelledAt: new Date(),
        refundStatus: "REQUESTED",
        refundDestination: "ORIGINAL_SOURCE",
        refundReason: reason || "Cancellation refund",
        refundAmount: order.amount,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled. Refund request submitted.",
      order: updated,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
