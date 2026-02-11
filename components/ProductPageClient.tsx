"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProductImage from "@/components/Product/ProductImage";
import ProductEmiCartDescription from "@/components/Product/ProductEmiCartDescription";

type ProductPageClientProps = {
  product: any;
  initialVariant: string | null;
};

export default function ProductPageClient({ 
  product, 
  initialVariant 
}: ProductPageClientProps) {
 const router = useRouter();
  const searchParams = useSearchParams();
  const urlVariant = searchParams.get("variant");
  
  // ✅ Use URL as source of truth, fallback to initialVariant
  const variantKey = urlVariant || initialVariant || product.variants[0]?.key;
  const [previewVariantKey, setPreviewVariantKey] = useState<string | null>(null);

  // ✅ Handle variant changes - only update URL
  const handleVariantChange = (newVariant: string) => {
    router.replace(`?variant=${newVariant}`, { scroll: false });
  };

  // Active variant logic
  const activeVariant =
    product.variants.find(
      (v: any) => v.key === (previewVariantKey ?? variantKey)
    ) ?? product.variants[0];

  const selectedVariant =
    product.variants?.find((v: any) => v.key === variantKey) ||
    product.variants?.[0];

  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
      <div className="px-2">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-4 lg:gap-8 relative">
          <ProductImage variant={activeVariant} product={product} />

          <ProductEmiCartDescription 
            variant={selectedVariant} 
            product={product} 
            setVariantKey={handleVariantChange} 
            setPreviewVariantKey={setPreviewVariantKey} 
            previewVariantKey={previewVariantKey} 
          />
        </div>
      </div>
    </section>
  );
}