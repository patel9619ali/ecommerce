import { Share } from "lucide-react";
import { AddToCartButton } from "../Loader/AddToCartButton";
import type { Product, Variant } from "@/data/types";
import { BuyNow } from "../Loader/BuyNow";

type Props = {
  product: Product;
  selectedVariant: Variant;
  onVariantChange: (key: string) => void;
};

export const BuyCartSection = ({
  product,
  selectedVariant,
  onVariantChange,
}: Props) => {
  return (
    <section className="w-full">
      <h3 className="lg:text-[32px] text-black/80 text-[28px] font-bold">BlendRas Portable Juicer</h3>
      <p className="text-black/80 lg:text-lg text-md text-black/80">Fresh juice anytime, anywhere</p>

      <span className="lg:text-[28px] text-[22px] font-semibold text-black/80">
        ₹ {selectedVariant.price.toLocaleString()}
      </span>

      <p className="lg:mt-3 mt-1 lg:text-[20px] text-[16px] text-black/80">
        Color: <span className="font-semibold">{selectedVariant.name}</span>
      </p>

      {/* COLOR SELECTOR */}
      <div className="mt-4 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide touch-pan-x lg:overflow-visible lg:flex-wrap">
        {product.variants.map((variant) => (
          <button
            key={variant.key}
            onClick={() => onVariantChange(variant.key)}
            className={`cursor-pointer w-15 h-15  hover:scale-110 transition-transform duration-500 ease-out rounded-full border-2 overflow-hidden
              ${
              variant.key === selectedVariant.key
                ? "border-white"
                : "border-white/40"
            }
            `}
          >
            <img
              src={variant.images[0].src}
              alt={variant.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Benefits */}
      {/* <div className="mt-6">
        {selectedVariant.benefits.map((b) => (
          <div key={b.id} className="flex items-center gap-2">
            <b.icon className="w-5 h-5" />
            <span>{b.label}</span>
          </div>
        ))}
      </div> */}
      <p className="mt-6 text-[14px] text-black/80">Hurry, only 7 items left in stock!</p>
      <div className="mt-6">
        <AddToCartButton productId={product.id} slug={product.slug} title={product.title} variant={selectedVariant}/>
      </div>
      <div className="mt-4">
        <BuyNow productId={product.id} slug={product.slug} title={product.title} variant={selectedVariant}/>
      </div>
      <div className="flex cursor-pointer items-center">
        <Share className="mt-6 w-6 h-6 cursor-pointer dark:text-black/60 hover:text-white/80  transition-colors duration-300 ease-out rotate-90" />
        <span className="text-black/80 text-[18px] ml-2 mt-6 hover:underline">Share</span>
      </div>
    </section>
  );
};
