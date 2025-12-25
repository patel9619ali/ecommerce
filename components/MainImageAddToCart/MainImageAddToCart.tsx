import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "./ProductGallery";
import { BuyCartSection } from "./BuyCartSection";
import { PRODUCT_VARIANTS } from "./productVariants";
export const MainImageAddToCart = () => {
  const [variantKey, setVariantKey] = useState<keyof typeof PRODUCT_VARIANTS>("black");
  const variant = PRODUCT_VARIANTS[variantKey];
  return (
    <section className="w-full bg-[#000000e6] py-5">
        <div className="container mx-auto">
            <div className="grid lg:grid-cols-[2.5fr_1.5fr]">
                <ProductGallery variant={variant} />
                <BuyCartSection
                  variantKey={variantKey}
                  setVariantKey={setVariantKey}
                  variant={variant}
                />
            </div>
        </div>
    </section>
  );
};