import { Share } from "lucide-react";
import { AddToCartButton } from "../Loader/AddToCartButton";
import { BuyNow } from "../Loader/BuyNow";
import { PRODUCT_VARIANTS } from "./productVariants";
type Props = {
  variantKey: string;
  setVariantKey: (key: any) => void;
  variant: any;
};

export const BuyCartSection = ({ variantKey, setVariantKey, variant }: Props) => {
  return (
    <section className="w-full text-white">
      <h3 className="text-[38px] font-bold">DYNASTY HEADPHONE</h3>
      <p className="text-white/80 text-lg">Ultimate over-ear headphones</p>

      <span className="text-[28px] font-semibold">
        ¥ {variant.price.toLocaleString()}
      </span>

      <p className="mt-3">
        Color: <span className="font-semibold">{variant.name}</span>
      </p>

      {/* COLOR SELECTOR */}
      <div className="flex gap-3 mt-4">
        {Object.entries(PRODUCT_VARIANTS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setVariantKey(key)}
            className={`cursor-pointer w-12 h-12  hover:scale-110 transition-transform duration-500 ease-out rounded-full border-2 overflow-hidden
              ${variantKey === key ? "border-white scale-120" : "border-white/40"}
            `}
          >
            <img
              src={value.images[0].src}
              alt={value.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Benefits */}
      <div className="mt-6">
        {variant.benefits.map((benefit:any) => (
          <div key={benefit.id} className="flex items-center gap-2 mb-2">
            <benefit.icon className="w-5 h-5" />
            <span>{benefit.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-white/80">Hurry, only 7 items left in stock!</p>
      <div className="mt-6">
        <AddToCartButton />
      </div>
      <div className="mt-6">
        <BuyNow/>
      </div>
      <div className="flex cursor-pointer items-center">
        <Share className="mt-6 w-6 h-6 cursor-pointer hover:text-white/80 transition-colors duration-300 ease-out rotate-90" />
        <span className="text-white/80 text-[18px] ml-2 mt-6 hover:underline">Share</span>
      </div>
    </section>
  );
};
