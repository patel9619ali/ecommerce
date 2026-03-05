import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

type RazorpayRefundEntity = {
  id?: string;
  payment_id?: string;
  notes?: {
    orderId?: string;
  };
};

type RazorpayWebhookEvent = {
  event?: string;
  payload?: {
    refund?: {
      entity?: RazorpayRefundEntity;
    };
    payment?: {
      entity?: {
        id?: string;
      };
    };
  };
};

const verifySignature = (rawBody: string, signature: string, secret: string) => {
  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const given = Buffer.from(signature, "utf8");
  const expected = Buffer.from(digest, "utf8");
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
};

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const rawBody = await request.text();
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody) as RazorpayWebhookEvent;
    const event = body.event;
    const refundEntity = body.payload?.refund?.entity;
    const paymentEntity = body.payload?.payment?.entity;

    if (!event) {
      return NextResponse.json({ ok: true });
    }

    if (event.startsWith("refund.")) {
      if (!refundEntity) {
        return NextResponse.json({ ok: true });
      }

      const refundId = refundEntity.id;
      const paymentId = refundEntity.payment_id;
      const noteOrderId = refundEntity.notes?.orderId;

      const orConditions: Prisma.OrderWhereInput[] = [];
      if (refundId) orConditions.push({ refundId });
      if (noteOrderId) orConditions.push({ id: noteOrderId });
      if (paymentId) orConditions.push({ razorpayPaymentId: paymentId });

      if (orConditions.length === 0) {
        return NextResponse.json({ ok: true });
      }

      const order = await db.order.findFirst({
        where: { OR: orConditions },
      });

      if (!order) {
        return NextResponse.json({ ok: true });
      }

      if (event === "refund.created") {
        await db.order.update({
          where: { id: order.id },
          data: {
            refundStatus: "PROCESSED",
            refundId: refundId ?? order.refundId,
          },
        });
      }

      if (event === "refund.processed") {
        await db.order.update({
          where: { id: order.id },
          data: {
            refundStatus: "COMPLETED",
            refundId: refundId ?? order.refundId,
            status: order.status === "CANCELLED" ? "CANCELLED" : "REFUNDED",
          },
        });
      }

      if (event === "refund.failed") {
        await db.order.update({
          where: { id: order.id },
          data: {
            refundStatus: "FAILED",
            refundId: refundId ?? order.refundId,
          },
        });
      }
    }

    if (event === "payment.captured") {
      const paymentId = paymentEntity?.id;
      if (paymentId) {
        const order = await db.order.findFirst({
          where: { razorpayPaymentId: paymentId },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: { status: "PROCESSING" },
          });
        }
      }
    }

    if (event === "payment.failed") {
      const paymentId = paymentEntity?.id;
      if (paymentId) {
        const order = await db.order.findFirst({
          where: { razorpayPaymentId: paymentId },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: { status: "PENDING" },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
