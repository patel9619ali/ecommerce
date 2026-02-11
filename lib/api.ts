import { productQuery } from "./queries/product";
import qs from "qs";
import { CacheConstant } from "./constants/constants";
export async function getProducts() {
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
      revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_DURATION || "0"),
      tags: [CacheConstant.revalidateTag]
    }
  });

  return res.json();
}

export async function getProductBySlug(slug: string) {
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
      revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_DURATION || "0"),
      tags: [CacheConstant.revalidateTag]
    }
  });
  return res.json();
}
