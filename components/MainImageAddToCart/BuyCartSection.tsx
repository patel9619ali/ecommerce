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
            className={`w-14 h-14 rounded-full border-2 overflow-hidden
              ${variantKey === key ? "border-white" : "border-white/40"}
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
    </section>
  );
};
