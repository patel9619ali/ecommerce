import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { sendRefundRequestedEmailToSeller } from "@/lib/mail";
import { isWithinReturnWindow } from "@/lib/order-policy";
import { syncCmsStockDeltas } from "@/lib/stock";

const REFUNDABLE_STATUS = "DELIVERED";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, reason, refundToWallet = false, proofImages = [] } = await req.json();
    const normalizedProofImages = Array.isArray(proofImages)
      ? proofImages
          .filter((url) => typeof url === "string" && url.trim().length > 0)
          .map((url) => url.trim())
          .slice(0, 3)
      : [];
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

    if (order.status === "CANCELLED" || order.status === "REFUNDED") {
      return NextResponse.json(
        { error: "Refund cannot be requested for this order status" },
        { status: 400 }
      );
    }

    if (order.status !== REFUNDABLE_STATUS) {
      return NextResponse.json(
        { error: "Refund is available only after the order is delivered" },
        { status: 400 }
      );
    }

    const fallbackDeliveredAt = order.status === "DELIVERED" ? order.createdAt : null;
    const refundStockItems = await db.orderItem.findMany({
      where: { orderId: order.id },
      select: { productId: true, variantId: true, quantity: true },
    });

    if (!isWithinReturnWindow(order.deliveredAt, new Date(), fallbackDeliveredAt)) {
      return NextResponse.json(
        { error: "The 7-day return window for this order has expired" },
        { status: 400 }
      );
    }

    if (order.paymentMethod === "COD") {
      if (order.deliveryStatus && order.deliveryStatus !== "SUCCESS") {
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
            refundProofImages: normalizedProofImages,
          },
        });
      });
      await syncCmsStockDeltas(refundStockItems);

      const customer = await db.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true },
      });
      await Promise.allSettled([
        sendRefundRequestedEmailToSeller({
          orderId: updatedCodRefund.id,
          amount: updatedCodRefund.amount,
          paymentMethod: updatedCodRefund.paymentMethod,
          refundDestination: updatedCodRefund.refundDestination,
          refundReason: updatedCodRefund.refundReason,
          customerName: customer?.name,
          customerEmail: customer?.email,
          customerPhone: customer?.phone,
          proofImages: normalizedProofImages,
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Refund credited to wallet",
        order: updatedCodRefund,
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
            reason: "Refund credited to wallet",
          },
        });

        return tx.order.update({
          where: { id: orderId },
          data: {
            status: "REFUNDED",
            refundStatus: "COMPLETED",
            refundDestination: "WALLET",
            refundReason: reason || "User requested refund",
            refundAmount: order.amount,
            refundId: `WALLET-${Date.now()}`,
            refundProofImages: normalizedProofImages,
          },
        });
      });
      await syncCmsStockDeltas(refundStockItems);

      const customer = await db.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true },
      });
      await Promise.allSettled([
        sendRefundRequestedEmailToSeller({
          orderId: updated.id,
          amount: updated.amount,
          paymentMethod: updated.paymentMethod,
          refundDestination: updated.refundDestination,
          refundReason: updated.refundReason,
          customerName: customer?.name,
          customerEmail: customer?.email,
          customerPhone: customer?.phone,
          proofImages: normalizedProofImages,
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Refund credited to wallet",
        order: updated,
      });
    }

    if (order.paymentMethod !== "RAZORPAY") {
      return NextResponse.json(
        { error: "Refund to original payment method is available only for online payments" },
        { status: 400 }
      );
    }

    if (!order.razorpayPaymentId) {
      return NextResponse.json(
        { error: "No Razorpay payment found for this order" },
        { status: 400 }
      );
    }

    await db.order.update({
      where: { id: orderId },
      data: {
        refundStatus: "PROCESSED",
        refundDestination: "ORIGINAL_SOURCE",
        refundReason: reason || "User requested refund",
        refundAmount: order.amount,
        refundProofImages: normalizedProofImages,
      },
    });

    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: order.amount * 100,
      notes: {
        orderId: order.id,
      },
    });

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status: "REFUNDED",
        refundStatus: "COMPLETED",
        refundDestination: "ORIGINAL_SOURCE",
        refundReason: reason || "User requested refund",
        refundAmount: order.amount,
        refundId: refund.id,
        refundProofImages: normalizedProofImages,
      },
    });
    await syncCmsStockDeltas(refundStockItems);

    const customer = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });
    await Promise.allSettled([
      sendRefundRequestedEmailToSeller({
        orderId: updated.id,
        amount: updated.amount,
        paymentMethod: updated.paymentMethod,
        refundDestination: updated.refundDestination,
        refundReason: updated.refundReason,
        customerName: customer?.name,
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        proofImages: normalizedProofImages,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Refund started to your original payment method",
      order: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to request refund" }, { status: 500 });
  }
}
