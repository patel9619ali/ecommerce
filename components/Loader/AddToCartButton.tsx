"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import type { Variant } from "@/data/types";

type Props = {
  productId: string;
  slug: string;
  title: string;
  variant: Variant;
};

export const AddToCartButton = ({
  productId,
  slug,
  title,
  variant,
}: Props) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleClick = () => {
    addItem({
      id: `${productId}-${variant.key}`,
      productId,
      slug,
      title,
      variantKey: variant.key,
      price: variant.price,
      image: variant.images[0].src,
      quantity: 1,
    });
 // 2️⃣ Facebook Pixel tracking (safe)
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "AddToCart", {
        content_ids: [`${productId}-${variant.key}`],
        content_name: title,
        content_type: "product",
        value: variant.price,
        currency: "INR",
      });
    }
  };
  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} >
        <button onClick={handleClick} aria-label="Previous slide" className=" group relative w-full flex items-center justify-center overflow-hidden border-[2px] border-black/60 py-3 font-bold text-white transition-colors duration-300 group-hover:text-black cursor-pointer" >
            <span className=" absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-10 pointer-events-none " />
            <span className={`uppercase relative z-20 group-hover:text-white text-black flex items-center gap-2 `}>
              ADD TO CART
            </span>
        </button>
      </motion.div>
    </>
  );
};  