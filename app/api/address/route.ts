// app/api/address/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressData = await req.json();
    
    // Create address in database
    const address = await db.address.create({  // ✅ Now works!
      data: {
        userId: session.user.id,
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        phone: addressData.phone,
        address: addressData.address,
        building: addressData.building || null,
        apartment: addressData.apartment || null,
        landmark: addressData.landmark || null,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Failed to save address:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}