import { productQuery } from "./queries/product";
import qs from "qs";
import { cacheTag, cacheLife } from "next/cache";
import { cache } from "react";
export const getProducts = cache(async function getProducts() {
  "use cache";

  cacheTag("homepage-products");
  cacheLife("hours");

  const baseUrl = process.env.NEXT_PUBLIC_CMS_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_CMS_URL is missing");
  }

  const url = `${baseUrl}/api/products?${productQuery}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`,
    },
    next: {
      revalidate: 3600,
      tags: ["homepage-products"],
    },
  });

  return res.json();
});

export async function getProductBySlug(slug: string) {
  "use cache";

  cacheTag(`product-${slug}`);
  cacheLife({ stale: 3600 });
  const query = qs.stringify({
    filters: {
      slug: { $eq: slug }
    },
    populate: {
      variant: {
        populate: {
          images: true,
          ReturnsAndWarranty: true
        }
      }
    }
  });

  const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/products?${query}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CMS_TOKEN}`,
    },
    next: {
      revalidate: 3600,
      tags: [`product-${slug}`], // ← IMPORTANT CHANGE
    }
  });
  const data = await res.json();
const cmsProduct = data?.data?.[0];

if (!cmsProduct) return null;

// ✅ normalize INSIDE cache layer
const product = {
  id: cmsProduct.id,
  title: cmsProduct.title,
  subTitle: cmsProduct.subTitle,
  description: cmsProduct.description,
  rating: cmsProduct.rating,
  ratingCount: cmsProduct.ratingCount,
  slug: cmsProduct.slug,
  variants: (cmsProduct.variant || []).map((v: any) => ({
    id: v.id,
    sku: v.sku,
    color: v.colorName,
    colorHex: v.colorHex,
    stock: Number(v.stock),
    sellingPrice: Number(v.sellingPrice),
    mrp: Number(v.mrp),
    images:
      v.images?.map((img: any) => ({
        url: img.url,
      })) || [],
    benefits: v.ReturnsAndWarranty || [],
  })),
};

return product;
}

export async function getProductLiveData(slug: string) {
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
    next: { revalidate: 10 } // 🔥 ALWAYS LIVE
  });

  const data = await res.json();
  const cmsProduct = data?.data?.[0];

  if (!cmsProduct) return null;

  return (cmsProduct.variant || []).map((v: any) => ({
    sku: v.sku,
    stock: Number(v.stock),
    sellingPrice: Number(v.sellingPrice),
    mrp: Number(v.mrp),
  }));
}