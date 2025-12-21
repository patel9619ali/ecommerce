import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "./ProductGallery";
import { BuyCartSection } from "./BuyCartSection";
export const MainImageAddToCart = () => {
  return (
    <section className="w-full bg-[#000000e6] py-5">
        <div className="container mx-auto">
            <div className="grid lg:grid-cols-[3fr_1fr]">
                <ProductGallery/>
                <BuyCartSection/>
            </div>
        </div>
    </section>
  );
};