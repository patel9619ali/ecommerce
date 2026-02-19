"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishListStore";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const handleToggle = () => {
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
      onClick={handleToggle}
      variant="outline"
      size="icon"
      className={cn(
        "cursor-pointer h-8 w-8 border-1 transition-colors",
        inWishlist 
          ? "!border-red-500 bg-red-50 hover:bg-red-100" 
          : "!border-[#000]",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-colors",
          inWishlist ? "fill-red-500 text-red-500" : "text-[#000]"
        )} 
      />
    </Button>
  );
}