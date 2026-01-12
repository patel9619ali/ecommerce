"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
type CartState = "idle" | "loading" | "success";
export const BuyNow = () => {
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
        <button aria-label="Previous slide" className=" group relative w-full flex items-center justify-center overflow-hidden border-[2px] border-black/60 py-3 font-bold text-white transition-colors duration-300 group-hover:text-black cursor-pointer bg-[#fff]" >
          <span className=" absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-10 pointer-events-none " />
            <span className={`uppercase relative z-20 group-hover:text-white text-black flex items-center gap-2 `}>
              Buy it now
            </span>
        </button>
      </motion.div>
    </>
  );
};  