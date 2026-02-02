"use client";

import Image from "next/image";
import type { Product } from "@/data/types";

type ProductColorSelectorProps = {
  product: Product;
  activeKey: string;
  previewVariantKey: string | null;
  onHover: (variantKey: string) => void;
  onLeave: () => void;
  onSelect: (variantKey: string) => void;
};

export function ProductColorSelector({
  product,
  activeKey,
  previewVariantKey,
  onHover,
  onLeave,
  onSelect,
}: ProductColorSelectorProps) {
  const displayKey = previewVariantKey ?? activeKey;

  return (
    <div>
      <p className="text-[#000] font-semibold mb-2 text-[#21242c]">
        Color: <span className="font-medium text-[#6a7181] capitalize">{displayKey}</span>
      </p>
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide w-full">

      <div className="flex gap-3 pb-2 w-max">
        {product.variants.map((variant) => (
          <button
  key={variant.key}
  onMouseEnter={() => onHover(variant.key)}
  onMouseLeave={onLeave}
  onClick={() => onSelect(variant.key)}
  className={` rounded-lg cursor-pointer w-[80px] transition-transform duration-500 ease-out  border-2 overflow-hidden ${variant.key === activeKey? "border-[#28af60] border-2": "border-[#28af6040] hover:border-white"}`} >
    
  {/* IMAGE (NO PADDING) */}
  <div className="w-full aspect-square rounded-lg duration-500 ease-out hover:scale-110">
    <Image
      src={variant.images[0]}
      alt={variant.name}
      width={80}
      height={80}
      className="w-full h-full object-cover"
    />
  </div>

  {/* PRICE */}
  {/* <div className="bg-black text-center py-1">
    <p className="text-[12px] text-white font-[500]">₹3,499</p>
    <p className="line-through text-[11px] text-white/80 font-[500]">
      ₹4,999
    </p>
  </div> */}
</button>

        ))}
      </div>
    </div>
    </div>
  );
}
