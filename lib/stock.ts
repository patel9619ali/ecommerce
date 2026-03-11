import qs from "qs";
import { db } from "@/lib/db";

type CmsVariantStock = {
  id: string;
  documentId?: string | null;
  sku: string;
  stock: number;
  sellingPrice: number;
  mrp: number;
};

type CmsProductStock = {
  productId: string;
  slug: string;
  variants: CmsVariantStock[];
};

const ACTIVE_ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const cmsHeaders = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`,
});

async function fetchCmsProductStock(
  filters: Record<string, unknown>
): Promise<CmsProductStock | null> {
  const query = qs.stringify({
    filters,
    populate: {
      variant: true,
    },
  });

  const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/products?${query}`;

  const res = await fetch(url, {
    headers: cmsHeaders(),
    next: {
      revalidate: 10,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CMS stock");
  }

  const data = await res.json();
  const product = data?.data?.[0];

  if (!product) {
    return null;
  }

  return {
    productId: String(product.id),
    slug: product.slug,
    variants: (product.variant || []).map((variant: any) => ({
      id: String(variant.id),
      documentId: variant.documentId || null,
      sku: String(variant.sku),
      stock: Number(variant.stock) || 0,
      sellingPrice: Number(variant.sellingPrice) || 0,
      mrp: Number(variant.mrp) || 0,
    })),
  };
}

export async function fetchCmsProductStockBySlug(slug: string) {
  return fetchCmsProductStock({
    slug: { $eq: slug },
  });
}

export async function fetchCmsProductStockById(productId: string) {
  return fetchCmsProductStock({
    id: { $eq: Number(productId) || productId },
  });
}

export async function getReservedStockMap(
  items: Array<{ productId: string; variantId: string }>
): Promise<Map<string, number>> {
  const uniqueItems = Array.from(
    new Map(items.map((item) => [`${item.productId}::${item.variantId}`, item])).values()
  );

  if (uniqueItems.length === 0) {
    return new Map();
  }

  const orderItems = await db.orderItem.findMany({
    where: {
      OR: uniqueItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
      })),
      order: {
        status: {
          in: [...ACTIVE_ORDER_STATUSES],
        },
      },
    },
    select: {
      productId: true,
      variantId: true,
      quantity: true,
    },
  });

  const reserved = new Map<string, number>();

  for (const item of orderItems) {
    const key = `${item.productId}::${item.variantId}`;
    reserved.set(key, (reserved.get(key) || 0) + item.quantity);
  }

  return reserved;
}

export async function getCheckoutAvailability(
  items: Array<{ productId: string; variantId: string; quantity: number; title: string }>
) {
  const products = await Promise.all(
    Array.from(new Set(items.map((item) => item.productId))).map(async (productId) => {
      const product = await fetchCmsProductStockById(productId);
      return [productId, product] as const;
    })
  );

  const productMap = new Map(products);
  const reserved = await getReservedStockMap(
    items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
    }))
  );

  return items.map((item) => {
    const product = productMap.get(item.productId);
    const variant = product?.variants.find((entry) => entry.sku === item.variantId);
    const reservedQty = reserved.get(`${item.productId}::${item.variantId}`) || 0;
    const available = Math.max(0, (variant?.stock || 0) - reservedQty);

    return {
      ...item,
      available,
      exists: Boolean(variant),
    };
  });
}

async function updateCmsVariantStock(variant: CmsVariantStock, nextStock: number) {
  const identifiers = [variant.id, variant.documentId].filter(Boolean) as string[];
  const payload = JSON.stringify({
    data: {
      stock: Math.max(0, nextStock),
    },
  });

  for (const identifier of identifiers) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/variants/${identifier}`, {
      method: "PUT",
      headers: {
        ...cmsHeaders(),
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (response.ok) {
      return true;
    }
  }

  return false;
}

export async function syncCmsStockDeltas(
  items: Array<{ productId: string; variantId: string; quantity: number }>
) {
  const grouped = new Map<string, number>();

  for (const item of items) {
    const key = `${item.productId}::${item.variantId}`;
    grouped.set(key, (grouped.get(key) || 0) + item.quantity);
  }

  const byProduct = new Map<string, Array<{ variantId: string; quantity: number }>>();
  for (const [key, quantity] of grouped.entries()) {
    const [productId, variantId] = key.split("::");
    const current = byProduct.get(productId) || [];
    current.push({ variantId, quantity });
    byProduct.set(productId, current);
  }

  for (const [productId, variants] of byProduct.entries()) {
    const product = await fetchCmsProductStockById(productId);
    if (!product) continue;

    for (const item of variants) {
      const variant = product.variants.find((entry) => entry.sku === item.variantId);
      if (!variant) continue;

      try {
        await updateCmsVariantStock(variant, variant.stock + item.quantity);
      } catch (error) {
        console.error("CMS stock sync failed", {
          productId,
          variantId: item.variantId,
          error,
        });
      }
    }
  }
}
