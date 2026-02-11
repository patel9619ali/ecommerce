"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Variant } from "@/data/types";

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
      id: `${productId}-${variant.sku}`,
      productId,
      slug,
      title,
      variantKey: variant.sku,
      price: Number(variant.sellingPrice),
      mrp: Number(variant.mrp),
      image: variant.images[0].url,
      quantity: 1,
    }, true);
 // 2️⃣ Facebook Pixel tracking (safe)
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "AddToCart", {
        content_ids: [`${productId}-${variant.sku}`],
        content_name: title,
        content_type: "product",
        value: variant.sellingPrice,
        currency: "INR",
      });
    }
  };
  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} >
        <button onClick={handleClick} aria-label="Previous slide" className="cursor-pointer flex-1 h-12 text-[16px] !bg-[#ffffff99] text-[#000] hover:text-[#254fda] hover:bg-[#eafaf1] border border-[#aeb2bb] rounded-lg w-full" >

              ADD TO CART
        </button>
      </motion.div>
    </>
  );
};  