"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import type { Product, Variant } from "@/data/types";
import { useState } from "react";
import { motion } from "framer-motion";
type Props = {
  product: Product;
  variant: Variant;
};

export default function ProductCartAndCheckout({ product, variant }: Props) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  console.log(variant,"variant");
  const handleAddToCart = () => {
    addItem({
      id: `${product.slug}-${variant.key}`,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: variant.price,
      quantity,
      variantKey: variant.key,
      image: variant.images[0].src, // ✅ FIX
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="border-[2px] border-black/20 rounded-lg p-4 text-black lg:sticky lg:top-20">
      <p className="text-2xl font-semibold mb-2">
        ₹ {variant.price / 100}
      </p>

      <p className="text-[14px] text-[#09090] font-[600] mb-1">
        FREE Delivery Tomorrow
      </p>

      <p className="text-[12px] text-black/70 mb-3">
        Delivering to Mumbai 400017
      </p>

      <p className="text-[#09090] text-2xl font-semibold mb-3">
        In stock
      </p>

      <p className="text-[12px] mb-1">
        Ships from <span className="font-semibold">Your Store</span>
      </p>
      <p className="text-[12px] mb-4">
        Sold by <span className="font-semibold">Your Brand</span>
      </p>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm mr-2">Quantity</label>
        <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="cursor-pointer bg-[#09090] text-[#000] lg:w-full md:w-[75%] w-1/2 border border-black/30 rounded px-2 py-1" >
          {[1, 2, 3, 4, 5].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-5">
            <button onClick={handleAddToCart} aria-label="Previous slide" className="rounded-[8px] group relative w-full flex items-center justify-center overflow-hidden border-[2px] border-black py-3 font-bold text-black transition-colors duration-300 group-hover:text-black cursor-pointer" >
                <span className=" absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-10 pointer-events-none " />
                <span className={`uppercase relative z-20 group-hover:text-white flex items-center gap-2 `}>
                ADD TO CART
                </span>
            </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} >
            <button onClick={handleBuyNow} aria-label="Previous slide" className="rounded-[8px] group relative w-full flex items-center justify-center overflow-hidden border-[2px] border-black py-3 font-bold text-black transition-colors duration-300 group-hover:text-black cursor-pointer" >
                <span className=" absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-10 pointer-events-none " />
                <span className={`uppercase relative z-20 group-hover:text-white flex items-center gap-2 `}>
                Buy Now
                </span>
            </button>
        </motion.div>

      <p className="text-xs text-black/60 mt-4 flex items-center gap-1">
        🔒 Secure transaction
      </p>
    </div>
  );
}
