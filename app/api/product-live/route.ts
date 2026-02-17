import { NextRequest } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return Response.json({ error: "slug required" }, { status: 400 });
  }

  const query = qs.stringify({
    filters: {
      slug: { $eq: slug },
    },
    populate: {
      variant: true,
    },
  });

  const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/products?${query}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`,
    },
    next: {
      revalidate: 10,
    }
  });

  const data = await res.json();
  const cmsProduct = data?.data?.[0];

  if (!cmsProduct) {
    return Response.json([]);
  }

  const liveData = (cmsProduct.variant || []).map((v: any) => ({
    sku: v.sku,
    stock: Number(v.stock),
    sellingPrice: Number(v.sellingPrice),
    mrp: Number(v.mrp),
  }));

  return Response.json(liveData);
}