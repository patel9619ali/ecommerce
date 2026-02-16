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
      orderBy: { createdAt: "desc" },
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

// ✅ POST - Create or Update address (UPSERT)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressData = await request.json();

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

    // ✅ Check if address exists for this user
    const existingAddress = await db.address.findFirst({
      where: { userId: session.user.id },
    });

    let savedAddress;

    if (existingAddress) {
      // ✅ UPDATE existing address
      savedAddress = await db.address.update({
        where: { id: existingAddress.id },
        data: {
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
    } else {
      // ✅ CREATE new address
      savedAddress = await db.address.create({
        data: {
          userId: session.user.id,
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

    return NextResponse.json({ 
      success: true, 
      address: savedAddress 
    });
  } catch (error: any) {
    console.error("Address save error:", error);

    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Address already exists for this user" },
        { status: 409 }
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

    // ✅ Update address (only if it belongs to current user)
    const updated = await db.address.updateMany({
      where: { 
        id,
        userId: session.user.id, // ✅ Security: only update own address
      },
      data: validation.data,
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