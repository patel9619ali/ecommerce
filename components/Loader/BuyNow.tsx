"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "../ui/button";
import { Variant } from "@/data/types";
type CartState = "idle" | "loading" | "success";
type Props = {
  productId: string;
  slug: string;
  title: string;
  variant: Variant;
};
export const BuyNow = ({
  productId,
  slug,
  title,
  variant,
}: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const [state, setState] = useState<CartState>("idle");
  const router = useRouter();
  const handleClick = () => {
    addItem({
      id: `${productId}-${variant?.sku}`,
      productId,
      slug,
      title,
      variantKey: variant?.sku,
      price: variant?.sellingPrice,
      mrp: variant?.mrp,
      image: variant?.images[0]?.url,
      quantity: 1,
    });
  }
    const handleBuyNow = () => {
        
        router.push(
            `/checkout`
          );
    };
  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} >
        <Button className="w-full h-13 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] text-[hsl(0_0%_100%)] font-bold text-sm md:text-base rounded-xl shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] hover:shadow-[0_10px_40px_-8px_hsl(252_80%_60%/0.18),0_4px_16px_-4px_hsl(240_15%_10%/0.06)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2 py-3 cursor-pointer" onClick={handleBuyNow} >
            Buy Now
        </Button>
      </motion.div>
    </>
  );
};  