"use client";

import { getProducts,getProductBySlug } from "@/lib/api";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProductImage from "@/components/Product/ProductImage";
import ProductEmiCartDescription from "@/components/Product/ProductEmiCartDescription";

export default function ProductPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const variantFromUrl = searchParams.get("variant");

  const [product, setProduct] = useState<any>(null);
  const [variantKey, setVariantKey] = useState<string | null>(null);
  const [previewVariantKey, setPreviewVariantKey] = useState<string | null>(null);

  /* -------------------------------------------------- */
  /* Fetch Product From Strapi */
  /* -------------------------------------------------- */
useEffect(() => {
  async function load() {
    if (!slug) return;

    const res = await getProductBySlug(slug as string);
    const cmsProduct = res?.data?.[0];
    if (!cmsProduct) return;

    const normalized = {
      id: cmsProduct.id,
      title: cmsProduct.title,
      subTitle: cmsProduct.subTitle,
      description: cmsProduct.description,
      rating: cmsProduct.rating,
      ratingCount: cmsProduct.ratingCount,
      slug: cmsProduct.slug,
      variants: (cmsProduct.variant || []).map((v: any) => ({
        id: v.id,
        key: v.sku,
        color: v.colorName,
        sellingPrice: v.sellingPrice,
        mrp: v.mrp,
        images: v.images?.map((img: any) => ({
          url: img.url,
        })) || [],
        benefits: v.ReturnsAndWarranty || [],
      })),
    };

    setProduct(normalized);

    if (!variantKey) {
      const initialVariant =
        variantFromUrl ||
        normalized.variants[0]?.key;

      setVariantKey(initialVariant);
    }
  }

  load();
}, [slug]);



  /* -------------------------------------------------- */
  /* Active Variant Logic */
  /* -------------------------------------------------- */
const activeVariant =
  product?.variants.find(
    (v:any) => v.key === (previewVariantKey ?? variantKey)
  ) ?? product?.variants[0];

const selectedVariant =
  product?.variants?.find((v: any) => v.key === variantKey) ||
  product?.variants?.[0];

  
useEffect(() => {
  if (!variantKey) return;

  router.replace(`?variant=${variantKey}`, { scroll: false });
}, [variantKey, router]);
console.log(product,"productproduct")

return (
  <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
    <div className="px-2">

      {!product || !variantKey ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-4 lg:gap-8 relative">

          <ProductImage variant={activeVariant} product={product} />

          <ProductEmiCartDescription variant={selectedVariant} product={product} setVariantKey={setVariantKey} setPreviewVariantKey={setPreviewVariantKey} previewVariantKey={previewVariantKey} />

        </div>
      )}

    </div>
  </section>
 
);

}
