import { NextRequest } from "next/server";
import { fetchCmsProductStockBySlug, getReservedStockMap } from "@/lib/stock";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return Response.json({ error: "slug required" }, { status: 400 });
  }

  const cmsProduct = await fetchCmsProductStockBySlug(slug);

  if (!cmsProduct) {
    return Response.json([]);
  }

  const reserved = await getReservedStockMap(
    cmsProduct.variants.map((variant) => ({
      productId: cmsProduct.productId,
      variantId: variant.sku,
    }))
  );

  const liveData = cmsProduct.variants.map((variant) => ({
    sku: variant.sku,
    stock: Math.max(0, variant.stock - (reserved.get(`${cmsProduct.productId}::${variant.sku}`) || 0)),
    sellingPrice: variant.sellingPrice,
    mrp: variant.mrp,
  }));

  return Response.json(liveData);
}
