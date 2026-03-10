import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutAddressSchema } from "@/schemas/checkout-schema";

// ✅ GET - Fetch user's saved address
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create or update address
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const { id, label = "HOME", isDefault = false, ...addressData } = payload || {};

    // ✅ Validate input
    const validation = CheckoutAddressSchema.safeParse(addressData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const {
      firstName, 
      lastName, 
      phone, 
      address, 
      building, 
      apartment, 
      landmark, 
      city, 
      state, 
      pincode 
    } = validation.data;

    const userId = session.user.id;
    const existingCount = await db.address.count({ where: { userId } });
    const nextDefault = Boolean(isDefault) || existingCount === 0;
    const normalizedLabel = ["HOME", "WORK", "OTHER"].includes(String(label).toUpperCase())
      ? String(label).toUpperCase()
      : "HOME";

    const savedAddress = await db.$transaction(async (tx) => {
      if (nextDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      if (id) {
        const existing = await tx.address.findFirst({
          where: { id, userId },
        });

        if (!existing) {
          throw new Error("Address not found or unauthorized");
        }

        return tx.address.update({
          where: { id },
          data: {
            label: normalizedLabel,
            isDefault: nextDefault,
            firstName,
            lastName,
            phone,
            address,
            building: building || null,
            apartment: apartment || null,
            landmark: landmark || null,
            city,
            state,
            pincode,
          },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label: normalizedLabel,
          isDefault: nextDefault,
          firstName,
          lastName,
          phone,
          address,
          building: building || null,
          apartment: apartment || null,
          landmark: landmark || null,
          city,
          state,
          pincode,
        },
      });
    });

    return NextResponse.json({ 
      success: true, 
      address: savedAddress 
    });
  } catch (error: unknown) {
    console.error("Address save error:", error);
    const err = error as { code?: string; message?: string };

    if (err.code === "P1001" || err.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    if (err.message === "Address not found or unauthorized") {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update specific address by ID (optional, for future use)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...addressData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    // ✅ Validate input
    const validation = CheckoutAddressSchema.safeParse(addressData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { label, isDefault } = addressData || {};
    const normalizedLabel = ["HOME", "WORK", "OTHER"].includes(String(label).toUpperCase())
      ? String(label).toUpperCase()
      : undefined;

    const updated = await db.$transaction(async (tx) => {
      if (isDefault === true) {
        await tx.address.updateMany({
          where: { userId: session.user.id },
          data: { isDefault: false },
        });
      }

      return tx.address.updateMany({
        where: {
          id,
          userId: session.user.id,
        },
        data: {
          ...validation.data,
          ...(normalizedLabel ? { label: normalizedLabel } : {}),
          ...(typeof isDefault === "boolean" ? { isDefault } : {}),
        },
      });
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address update error:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    const userId = session.user.id;

    const existing = await db.address.findFirst({
      where: { id, userId },
      select: { id: true, isDefault: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id },
      });

      if (existing.isDefault) {
        const nextDefault = await tx.address.findFirst({
          where: { userId },
          orderBy: [{ updatedAt: "desc" }],
          select: { id: true },
        });

        if (nextDefault) {
          await tx.address.update({
            where: { id: nextDefault.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
