"use client";


import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { PRODUCT_VARIANTS } from "../MainImageAddToCart/productVariants";

type VariantKey = keyof typeof PRODUCT_VARIANTS;

type Props = {
  productId: string;
  title: string;
  variantKey: VariantKey;
};

export const AddToCartButton = ({
  productId,
  title,
  variantKey,
}: Props) => {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const variant = PRODUCT_VARIANTS[variantKey]; // ✅ always defined now

  const handleClick = () => {
    addItem({
      id: `${productId}-${variantKey}`,
      title,
      variantKey,
      price: variant.price,
      image: variant.images[0].src,
      quantity: 1,
    });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} >
        <button onClick={handleClick} aria-label="Previous slide" className=" group relative w-full flex items-center justify-center overflow-hidden border-[2px] border-white py-3 font-bold text-white transition-colors duration-300 group-hover:text-black cursor-pointer" >
            <span className=" absolute inset-0 bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-10 pointer-events-none " />
            <span className={`uppercase relative z-20 group-hover:text-black flex items-center gap-2 `}>
              ADD TO CART
            </span>
        </button>
      </motion.div>
    </>
  );
};  