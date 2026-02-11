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
  
  // ✅ Initialize with initialVariant from server
  const [variantKey, setVariantKey] = useState<string | null>(null);;
  const [previewVariantKey, setPreviewVariantKey] = useState<string | null>(null);

  // Sync variant with URL changes
  useEffect(() => {
    const urlVariant = searchParams.get("variant");
    if (urlVariant && urlVariant !== variantKey) {
      setVariantKey(urlVariant);
    }
  }, [searchParams, variantKey]);

  // Update URL when variant changes (client-side navigation)
  useEffect(() => {
    if (!variantKey) return;

    const currentVariant = searchParams.get("variant");
    if (currentVariant !== variantKey) {
      router.replace(`?variant=${variantKey}`, { scroll: false });
    }
  }, [variantKey, router, searchParams]);

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
            setVariantKey={setVariantKey} 
            setPreviewVariantKey={setPreviewVariantKey} 
            previewVariantKey={previewVariantKey} 
          />
        </div>
      </div>
    </section>
  );
}