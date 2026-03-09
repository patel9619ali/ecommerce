import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  sendOrderCancelledEmailToCustomer,
  sendOrderCancelledEmailToSeller,
} from "@/lib/mail";

const CANCELLABLE_STATUSES = new Set(["PENDING", "PROCESSING"]);

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, reason, comment, refundToWallet = true } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return NextResponse.json({ error: "Cancellation reason is required" }, { status: 400 });
    }

    const safeReason = reason.trim();
    const safeComment =
      typeof comment === "string" && comment.trim().length > 0 ? comment.trim() : null;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
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

    const customer = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });
    const customerAddress = await db.address.findFirst({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        building: true,
        apartment: true,
        landmark: true,
        city: true,
        state: true,
        pincode: true,
      },
    });

    const mailItems = order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      variantId: item.variantId,
    }));

    const sendCancellationEmails = async (updatedOrder: {
      id: string;
      amount: number;
      paymentMethod: string;
      refundDestination: string | null;
    }) => {
      await Promise.allSettled([
        customer?.email
          ? sendOrderCancelledEmailToCustomer({
              email: customer.email,
              customerName: customer.name,
              orderId: updatedOrder.id,
              amount: updatedOrder.amount,
              paymentMethod: updatedOrder.paymentMethod,
              reason: safeReason,
              comment: safeComment,
              refundDestination: updatedOrder.refundDestination,
              items: mailItems,
              address: customerAddress,
            })
          : Promise.resolve(),
        sendOrderCancelledEmailToSeller({
          orderId: updatedOrder.id,
          amount: updatedOrder.amount,
          paymentMethod: updatedOrder.paymentMethod,
          reason: safeReason,
          comment: safeComment,
          customerEmail: customer?.email ?? null,
          customerName: customer?.name ?? null,
          customerPhone: customer?.phone ?? null,
          refundDestination: updatedOrder.refundDestination,
          items: mailItems,
          address: customerAddress,
        }),
      ]);
    };

    if (order.paymentMethod === "COD") {
      const updated = await db.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
          cancellationReason: safeReason,
          cancellationComment: safeComment,
          cancelledAt: new Date(),
        },
      });
      await sendCancellationEmails({
        id: updated.id,
        amount: updated.amount,
        paymentMethod: updated.paymentMethod,
        refundDestination: null,
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
            cancellationReason: safeReason,
            cancellationComment: safeComment,
            cancelledAt: new Date(),
            refundStatus: "COMPLETED",
            refundDestination: "WALLET",
            refundReason: safeReason,
            refundAmount: order.amount,
            refundId: `WALLET-CANCEL-${Date.now()}`,
          },
        });
      });

      await sendCancellationEmails({
        id: updated.id,
        amount: updated.amount,
        paymentMethod: updated.paymentMethod,
        refundDestination: updated.refundDestination,
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
        cancellationReason: safeReason,
        cancellationComment: safeComment,
        cancelledAt: new Date(),
        refundStatus: "REQUESTED",
        refundDestination: "ORIGINAL_SOURCE",
        refundReason: safeReason,
        refundAmount: order.amount,
      },
    });

    await sendCancellationEmails({
      id: updated.id,
      amount: updated.amount,
      paymentMethod: updated.paymentMethod,
      refundDestination: updated.refundDestination,
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled. Refund request submitted to your original payment method.",
      order: updated,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
