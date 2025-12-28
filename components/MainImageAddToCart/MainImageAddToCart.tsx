import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ProductGallery } from "./ProductGallery";
import { BuyCartSection } from "./BuyCartSection";
import { PRODUCT_VARIANTS } from "./productVariants";
export const MainImageAddToCart = () => {
  console.log(useCartStore,"useCartStore")
  const [selectedVariant, setSelectedVariant] = useState<keyof typeof PRODUCT_VARIANTS>("black");
  const variant = PRODUCT_VARIANTS[selectedVariant];
  return (
    <section className="w-full bg-[#000000e6] py-5">
        <div className="container mx-auto">
            <div className="grid lg:grid-cols-[2.5fr_1.5fr]">
                <ProductGallery variant={variant} />
                <BuyCartSection
                  variantKey={selectedVariant}
                  setVariantKey={setSelectedVariant}
                  variant={variant}
                />
            </div>
        </div>
    </section>
  );
};