"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishListStore";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence,motion } from "framer-motion";

type WishlistButtonProps = {
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
  colorName?: string;
  colorHex?: string;
  className?: string;
};

export function WishlistButton({
  productId,
  variantId,
  slug,
  title,
  price,
  mrp,
  image,
  colorName,
  colorHex,
  className,
}: WishlistButtonProps) {
  const user = useCurrentUser();
  const router = useRouter();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(productId, variantId);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();     // 🔥 prevents link navigation
  e.stopPropagation();    // 🔥 stops bubbling

  if (!user) {
    router.push("/sign-in?callbackUrl=/user-profile/wishlist");
    return;
  }

  if (inWishlist) {
    removeItem(productId, variantId);
  } else {
    addItem({
      id: crypto.randomUUID(),
      productId,
      variantId,
      slug,
      title,
      price,
      mrp,
      image,
      colorName,
      colorHex,
    });
  }
};

  return (
    <Button
  type="button"
  onClick={handleToggle}
  variant="outline"
  size="icon"
  className={cn(
    "cursor-pointer h-8 w-8 border-1 transition-colors relative overflow-visible",
    inWishlist 
      ? "!border-red-500 bg-red-50 hover:bg-red-100" 
      : "!border-[#000]",
    className
  )}
>
  <motion.div
    key={inWishlist ? "filled" : "empty"}
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Heart
      className={cn(
        "h-5 w-5 transition-colors",
        inWishlist ? "fill-red-500 text-red-500" : "text-[#000]"
      )}
    />
  </motion.div>

  {/* Floating Added Label */}
  <AnimatePresence>
    {inWishlist && (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: -25 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bg-[#000] text-[10px] font-semibold bg-black text-white px-2 py-0.5 rounded-md"
      >
        Added ❤️
      </motion.span>
    )}
  </AnimatePresence>
</Button>
  );
}