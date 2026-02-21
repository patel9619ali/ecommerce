import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const finalAmount = Math.round(Number(amount) * 100);

    console.log("Incoming amount:", amount);
    console.log("Final amount (paise):", finalAmount);

    const order = await razorpay.orders.create({
      amount: finalAmount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ order });
  } catch (e: any) {
    console.error("RAZORPAY ERROR:", e);
    return NextResponse.json(
      { error: e.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}