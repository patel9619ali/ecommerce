"use client";

import Image from "next/image";
import { Product,Variant } from "@/data/types";

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
        Color: <span className="font-medium text-[#6a7181] capitalize"> {displayKey.replace(/-/g, ' ').toUpperCase()} </span>
      </p>
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide w-full">

    <div className="flex gap-3 pb-2 w-max" onMouseLeave={onLeave}>
      {product?.variants.map((variantItem) => (
        <button
          key={variantItem.key}
          onMouseEnter={() => onHover(variantItem.key)}
          
          onClick={() => {
            onSelect(variantItem.key);
          }}
          className={`rounded-lg cursor-pointer w-[80px] transition-transform duration-500 ease-out border-2 overflow-hidden
            ${
              variantItem.key === activeKey
                ? "border-[#28af60]"
                : "border-[#28af6040] hover:border-white"
            }`}
        >
          <div className="w-full aspect-square rounded-lg duration-500 ease-out hover:scale-110">
            <Image
              src={`${process.env.NEXT_PUBLIC_CMS_URL}${variantItem.images[0].url}`}
              alt={variantItem.key}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      ))}
    </div>

    </div>
    </div>
  );
}
