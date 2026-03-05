import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, reason, refundToWallet = false } = await req.json();
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

    if (order.refundStatus) {
      return NextResponse.json({ error: "Refund already requested" }, { status: 400 });
    }

    if (order.paymentMethod === "COD") {
      if (order.status !== "DELIVERED") {
        return NextResponse.json(
          { error: "COD refund allowed only after delivered order" },
          { status: 400 }
        );
      }

      if (!order.deliveryId || order.deliveryStatus !== "SUCCESS") {
        return NextResponse.json(
          { error: "Delivery verification failed. COD refund cannot start." },
          { status: 400 }
        );
      }

      const updatedCodRefund = await db.$transaction(async (tx) => {
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
            reason: "COD refund credited after delivery verification",
          },
        });

        return tx.order.update({
          where: { id: orderId },
          data: {
            status: "REFUNDED",
            refundStatus: "COMPLETED",
            refundDestination: "WALLET",
            refundReason: reason || "COD refund requested",
            refundAmount: order.amount,
            refundId: `COD-WALLET-${Date.now()}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "COD refund credited instantly to wallet",
        order: updatedCodRefund,
      });
    }

    if (order.paymentMethod === "WALLET" && !refundToWallet) {
      return NextResponse.json(
        { error: "Wallet-paid orders can only be refunded to wallet" },
        { status: 400 }
      );
    }

    if (order.status === "CANCELLED" || order.status === "REFUNDED") {
      return NextResponse.json(
        { error: "Refund cannot be requested for this order status" },
        { status: 400 }
      );
    }

    if (refundToWallet) {
      const updated = await db.$transaction(async (tx) => {
        const nextStatus = order.status === "DELIVERED" ? "REFUNDED" : order.status;

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
            reason: "Refund credited to wallet",
          },
        });

        return tx.order.update({
          where: { id: orderId },
          data: {
            status: nextStatus,
            refundStatus: "COMPLETED",
            refundDestination: "WALLET",
            refundReason: reason || "User requested refund",
            refundAmount: order.amount,
            refundId: `WALLET-${Date.now()}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Refund credited to wallet",
        order: updated,
      });
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        refundStatus: "REQUESTED",
        refundDestination: "ORIGINAL_SOURCE",
        refundReason: reason || "User requested refund",
        refundAmount: order.amount,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Refund requested successfully",
      order: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to request refund" }, { status: 500 });
  }
}
