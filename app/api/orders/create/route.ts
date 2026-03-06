import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  sendOrderPlacedEmailToCustomer,
  sendOrderPlacedEmailToSeller,
} from "@/lib/mail";

type CheckoutItem = {
  productId: string;
  variantKey: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderWithItems = {
  id: string;
  amount: number;
  paymentMethod: "COD" | "RAZORPAY" | "WALLET";
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
};

const getPaymentMethod = (paymentMethod?: string) => {
  if (paymentMethod === "cod") return "COD";
  if (paymentMethod === "razorpay") return "RAZORPAY";
  if (paymentMethod === "wallet") return "WALLET";
  return null;
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total, paymentMethod, razorpayPaymentId } = await request.json();
    const normalizedPaymentMethod = getPaymentMethod(paymentMethod);

    if (!normalizedPaymentMethod) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (typeof total !== "number" || !Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
    }

    const sanitizedItems = items as CheckoutItem[];
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const roundedTotal = Math.round(total);

    if (normalizedPaymentMethod === "WALLET") {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });

      if (!user || user.walletBalance < roundedTotal) {
        return NextResponse.json(
          { error: "Insufficient wallet balance" },
          { status: 400 }
        );
      }
    }

    const fullOrder = await db.$transaction(async (tx: Prisma.TransactionClient): Promise<OrderWithItems | null> => {
      const order = await tx.order.create({
        data: {
          id: orderId,
          userId,
          amount: roundedTotal,
          paymentMethod: normalizedPaymentMethod,
          status: normalizedPaymentMethod === "COD" ? "PENDING" : "PROCESSING",
          razorpayPaymentId: normalizedPaymentMethod === "RAZORPAY" ? razorpayPaymentId : null,
          createdAt: new Date(),
        },
      });

      await tx.orderItem.createMany({
        data: sanitizedItems.map((item: CheckoutItem) => ({
          id: `${orderId}-${item.productId}-${item.variantKey}`,
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantKey,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
        })),
      });

      const wishlist = await tx.wishlist.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (wishlist && sanitizedItems.length > 0) {
        await tx.wishlistItem.deleteMany({
          where: {
            wishlistId: wishlist.id,
            OR: sanitizedItems.map((item: CheckoutItem) => ({
              productId: item.productId,
              variantId: item.variantKey,
            })),
          },
        });
      }

      if (normalizedPaymentMethod === "WALLET") {
        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { decrement: roundedTotal } },
        });

        await tx.walletTransaction.create({
          data: {
            userId,
            orderId: order.id,
            type: "DEBIT",
            amount: roundedTotal,
            reason: "Order payment via wallet",
          },
        });
      }

      return tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
    });

    const customerEmail = session.user.email;
    if (fullOrder) {
      const mailItems = fullOrder.items.map((item: OrderWithItems["items"][number]) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      }));

      await Promise.allSettled([
        customerEmail
          ? sendOrderPlacedEmailToCustomer({
              email: customerEmail,
              customerName: session.user.name,
              orderId: fullOrder.id,
              amount: fullOrder.amount,
              paymentMethod: fullOrder.paymentMethod,
              items: mailItems,
            })
          : Promise.resolve(),
        sendOrderPlacedEmailToSeller({
          orderId: fullOrder.id,
          customerEmail: customerEmail ?? null,
          amount: fullOrder.amount,
          paymentMethod: fullOrder.paymentMethod,
          items: mailItems,
        }),
      ]);
    }

    return NextResponse.json({ success: true, order: fullOrder });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
