"use client";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, Minus, Plus, ChevronRight } from "lucide-react";
export function ProductBenefitsCarousel({ benefits }: any) {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false });

  return (
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="flex flex-col items-center text-center p-3 rounded-lg bg-[#f3f4f6] shadow-sm">
          <Truck className="h-6 w-6 text-[#28af60] mb-2" />
          <span className="text-xs font-medium text-[#000]">Free Delivery</span>
          <span className="text-xs text-[#6a7181]">Orders over ₹999</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-lg bg-[#f3f4f6] shadow-sm">
          <RotateCcw className="h-6 w-6 text-[#28af60] mb-2" />
          <span className="text-xs font-medium text-[#000]">7 Days Return</span>
          <span className="text-xs text-[#6a7181]">Easy returns</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-lg bg-[#f3f4f6] shadow-sm">
          <ShieldCheck className="h-6 w-6 text-[#28af60] mb-2" />
          <span className="text-xs font-medium text-[#000]">1 Year Warranty</span>
          <span className="text-xs text-[#6a7181]">Manufacturer</span>
        </div>
      </div>
  );
}
