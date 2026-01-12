import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ProductGallery } from "./ProductGallery";
import { BuyCartSection } from "./BuyCartSection";
import { PRODUCTS } from "@/data/products";
import type { Variant } from "@/data/types";
export const MainImageAddToCart = () => {
  /** 1️⃣ Pick the product (homepage featured product) */
  const product = PRODUCTS[0]; // DYNASTY HEADPHONE

  /** 2️⃣ Variant state */
  const [variantKey, setVariantKey] = useState(
    product.variants[0].key
  );

  /** 3️⃣ Selected variant */
  const selectedVariant = product.variants.find(
    (v) => v.key === variantKey
  ) as Variant;
  return (
    <section className="w-full bg-[#fff] py-5">
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