"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "../ui/button";
import type { Variant } from "@/data/types";
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
      id: `${productId}-${variant.key}`,
      productId,
      slug,
      title,
      variantKey: variant.key,
      price: variant.price,
      image: variant.images[0].src,
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
        <Button className="w-full flex-1 h-12 text-[16px] cursor-pointer !border-[#254fda] !bg-[#254fda] hover:!bg-[#254fda] hover:!text-[#fff] rounded-lg" onClick={handleBuyNow} >
            Buy Now
        </Button>
      </motion.div>
    </>
  );
};  