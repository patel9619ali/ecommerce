"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
type CartState = "idle" | "loading" | "success";
export const AddToCartButton = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [state, setState] = useState<CartState>("idle");

  const handleAddToCart = () => {
    if (state !== "idle") return;

    setState("loading");

    // Simulate API call
    setTimeout(() => {
      setState("success");

      setTimeout(() => {
        setState("idle");
      }, 1400);
    }, 1200);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} >
        <button onClick={() =>
        addToCart({
          id: "car-1",
          name: "BMW X5",
          price: 45000,
          quantity: 1,
        })
      } aria-label="Previous slide" className=" group relative w-full flex items-center justify-center overflow-hidden border-[2px] border-white py-3 font-bold text-white transition-colors duration-300 group-hover:text-black cursor-pointer" >
            <span className=" absolute inset-0 bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-10 pointer-events-none " />
            <span className={`uppercase relative z-20 group-hover:text-black flex items-center gap-2 ${state === "idle" ? "block opacity-100 translate-y-0" : "hidden opacity-0 translate-y-3"} `}>
              ADD TO CART
            </span>

          {/* LOADING */}
          <span className={`uppercase relative z-20 group-hover:text-black flex items-center gap-2 ${state === "loading" ? "block opacity-100" : "hidden opacity-0"} `} >
            <Loader2 className="animate-spin" size={20} />
          </span>

          {/* SUCCESS */}
          <span className={`uppercase relative z-20 group-hover:text-black flex items-center gap-2 ${state === "success" ? "block opacity-100 scale-100" : "hidden scale-75"} `} >
            <Check size={20} />
            Added
          </span>
        </button>
      </motion.div>
    </>
  );
};  