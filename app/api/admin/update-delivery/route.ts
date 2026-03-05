import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, deliveryId, deliveryStatus } = await req.json();
    if (!orderId || !deliveryId || !deliveryStatus) {
      return NextResponse.json(
        { error: "orderId, deliveryId and deliveryStatus are required" },
        { status: 400 }
      );
    }

    const rawStatus = String(deliveryStatus).toUpperCase();
    if (!["PENDING", "IN_TRANSIT", "SUCCESS", "FAILED"].includes(rawStatus)) {
      return NextResponse.json({ error: "Invalid deliveryStatus" }, { status: 400 });
    }
    const normalizedStatus = rawStatus as "PENDING" | "IN_TRANSIT" | "SUCCESS" | "FAILED";

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        deliveryId,
        deliveryStatus: normalizedStatus,
        deliveredAt: normalizedStatus === "SUCCESS" ? new Date() : null,
        status: normalizedStatus === "SUCCESS" ? "DELIVERED" : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Update delivery error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update delivery" },
      { status: 500 }
    );
  }
}
