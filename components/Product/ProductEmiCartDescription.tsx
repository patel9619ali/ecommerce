"use client";


import type { Product, Variant } from "@/data/types";
import Link from "next/link";
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, Minus, Plus, ChevronRight } from "lucide-react";
import { ProductBenefitsCarousel } from "./ProductBenefitsCarousel";
import { ProductColorSelector } from "./ProductColorSelector";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { BuyNow } from "../Loader/BuyNow";
type Props = {
  product: Product;
  variant: Variant;
  setVariantKey: React.Dispatch<React.SetStateAction<string>>
  setPreviewVariantKey: React.Dispatch<React.SetStateAction<string | null>>
  previewVariantKey: string | null
};

export default function ProductEmiCartDescription({ product, variant,setVariantKey,setPreviewVariantKey,previewVariantKey }: Props) {
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
        router.push(
            `/checkout?name=${product.title}&color=${variant.key}&qty=${quantity}&price=${variant.price}&originalPrice=${4999}`
          );
    };
      const originalPrice = 4999;
    const discountedPrice = 3499;
    const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    return(
        <>
        <div className="space-y-6">
          <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-[#eafaf1] text-[#1e8549] hover:bg-[#f3f4f6cc]">New Arrival</Badge>
                <Badge variant="outline" className="text-[#28af60] border-[#28af60]">-{discountPercent}% OFF</Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#21242c] mb-2">
                BlendRas Portable Juicer Pro
              </h1>
              <p className="text-[#6a7181] mb-3">
                Powerful 400ml portable blender with USB-C charging
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? "fill-[#f59f0a] text-[#f59f0a]" : "fill-[#8e9dbc] text-[#aab7c4bf]"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#6a7181]">4.2 (2,847 reviews)</span>
                <span className="text-sm text-[#28af60] font-medium">500+ bought last month</span>
              </div>
            </div>

            <Separator />
          
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#21242c]">₹{discountedPrice.toLocaleString()}</span>
                <span className="text-lg text-[#6a7181] line-through">₹{originalPrice.toLocaleString()}</span>
                <span className="text-[#28af60] font-semibold">Save ₹{(originalPrice - discountedPrice).toLocaleString()}</span>
              </div>
              <p className="text-sm text-[#6a7181] mt-1">Inclusive of all taxes</p>
            </div>

            <Separator />
            <ProductColorSelector product={product} activeKey={variant.key} onHover={setPreviewVariantKey} onLeave={() => setPreviewVariantKey(null)} onSelect={setVariantKey} previewVariantKey={previewVariantKey}/>
            <Separator/>
            
        
            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-[#21242c] mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#aeb2bb] rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="cursor-pointer rounded-r-none"
                  >
                    <Minus className="h-4 w-4 text-[#000]" />
                  </Button>
                  <span className="w-12 text-center font-medium text-[#000]">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="cursor-pointer rounded-l-none"
                  >
                    <Plus className="h-4 w-4 text-[#000]" />
                  </Button>
                </div>
                <span className="text-sm text-[#28af60] font-medium">In Stock</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <Button className="cursor-pointer flex-1 h-12 text-[16px] !bg-[#ffffff99] text-[#000] hover:text-[#254fda] hover:bg-[#eafaf1] border border-[#aeb2bb] rounded-lg" variant="outline" onClick={handleAddToCart} >
                Add to Cart
              </Button>
              <BuyNow productId={product.id} slug={product.slug} title={product.title} variant={variant}/>
              
            </div>

          <ProductBenefitsCarousel benefits={variant.benefits} />
          <div className="flex justify-between">
            <p className="text-xs text-black/60 flex items-center gap-1 text-[15px]">
              🔒 Secure transaction
            </p>
            <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8 border-1 !border-[#000]">
              <Share2 className="h-5 w-5 text-[#000]" />
            </Button>
          </div>
        </div>

            {/* <div className="mt-6">
                <h3 className="text-black text-lg font-semibold mb-2">
                    About this item
                </h3>

                <ul className="list-disc pl-5 space-y-1 text-black/90 text-sm">
                    <li>120-hour battery life with fast charging</li>
                    <li>Hybrid Active Noise Cancellation</li>
                    <li>40mm dynamic drivers</li>
                    <li>Dual pairing & spatial audio</li>
                </ul>
            </div> */}
        </>
    )
}