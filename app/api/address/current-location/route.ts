import { NextRequest, NextResponse } from "next/server";

const buildFallbackAddress = (data: any) => ({
  addressLine: [
    data.locality,
    data.localityInfo?.administrative?.[2]?.name,
    data.principalSubdivision,
  ]
    .filter(Boolean)
    .join(", "),
  city: data.city || data.locality || "",
  state: data.principalSubdivision || "",
  pincode: data.postcode || "",
  landmark: data.locality || "",
});

export async function GET(request: NextRequest) {
  try {
    const latitude = request.nextUrl.searchParams.get("lat");
    const longitude = request.nextUrl.searchParams.get("lng");

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
      {
        headers: {
          "User-Agent": "BlendRas/1.0 (reverse-geocode)",
          "Accept-Language": "en",
        },
        cache: "no-store",
      }
    );

    if (nominatimRes.ok) {
      const data = await nominatimRes.json();
      const address = data?.address || {};
      const addressLine =
        [
          address.house_number,
          address.road || address.pedestrian || address.footway,
          address.neighbourhood || address.suburb || address.quarter,
        ]
          .filter(Boolean)
          .join(", ") ||
        (typeof data?.display_name === "string"
          ? data.display_name.split(",").slice(0, 3).join(", ").trim()
          : "");

      if (addressLine || address.city || address.state) {
        return NextResponse.json({
          addressLine,
          city:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "",
          state: address.state || address.state_district || "",
          pincode: address.postcode || "",
          landmark:
            address.neighbourhood ||
            address.suburb ||
            address.quarter ||
            address.landmark ||
            "",
        });
      }
    }

    const bigDataRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      {
        cache: "no-store",
      }
    );

    if (!bigDataRes.ok) {
      return NextResponse.json({ error: "Unable to fetch current location" }, { status: 502 });
    }

    const geoData = await bigDataRes.json();
    return NextResponse.json(buildFallbackAddress(geoData));
  } catch (error) {
    console.error("Current location lookup failed:", error);
    return NextResponse.json(
      { error: "Unable to fetch current location" },
      { status: 500 }
    );
  }
}
