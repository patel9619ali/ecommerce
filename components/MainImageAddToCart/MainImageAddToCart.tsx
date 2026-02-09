'use client';
import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { BuyCartSection } from "./BuyCartSection";
import { Product } from "@/data/types";
import type { Variant } from "@/data/types";
type Props = {
  productData?: Product[];
}
export const MainImageAddToCart = ({productData}:Props) => {
  /** 1️⃣ Pick the product (homepage featured product) */
   const product = productData?.[0];

  const [variantKey, setVariantKey] = useState<string | null>(
    product?.variant?.[0]?.sku ?? null
  );

  const selectedVariant =
    product?.variant?.find(v => v.sku === variantKey) ||
    product?.variant?.[0];

  if (!product || !selectedVariant) return null;
  return (
    <section className="w-full bg-[#fff] py-14">
        <div className="container mx-auto">
            <div className="grid lg:grid-cols-[2.5fr_1.5fr]">
                <ProductGallery variant={selectedVariant} />
                <BuyCartSection
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={setVariantKey}
                />
            </div>
        </div>
    </section>
  );
};