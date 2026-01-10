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
      <p className="text-white font-medium mb-2">
        Colour: <span className="font-semibold">{displayKey}</span>
      </p>

      <div className="flex gap-3">
        {product.variants.map((variant) => (
          <button
            key={variant.key}
            onMouseEnter={() => onHover(variant.key)}
            onMouseLeave={onLeave}
            onClick={() => onSelect(variant.key)}
            className={`cursor-pointer border rounded-lg p-1 transition
              ${
                variant.key === activeKey
                  ? "border-white"
                  : "border-white/30 hover:border-white"
              }`}
          >
            <Image
              src={variant.images[0]}
              alt={variant.name}
              width={60}
              height={60}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
