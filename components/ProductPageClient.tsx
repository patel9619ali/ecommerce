"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProductImage from "@/components/Product/ProductImage";
import ProductEmiCartDescription from "@/components/Product/ProductEmiCartDescription";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
type ProductPageClientProps = {
  product: any;
  initialVariant: string | null;
};
const specs = [
  { label: "Capacity", value: "400ml / 13oz" },
  { label: "Blade Material", value: "304 Stainless Steel, 6 Blades" },
  { label: "Motor Speed", value: "22,000 RPM" },
  { label: "Charging", value: "USB Type-C" },
  { label: "Charge Time", value: "2-3 Hours" },
  { label: "Weight", value: "260g" },
  { label: "Dimensions", value: "86mm × 86mm × 246mm" },
  { label: "Material", value: "BPA-Free Tritan + ABS" },
];

const images = ["🫗", "🥤", "🧃", "🍹"];
export default function ProductPageClient({ 
  product, 
  initialVariant 
}: ProductPageClientProps) {
 const router = useRouter();
  const searchParams = useSearchParams();
  const urlVariant = searchParams.get("variant");
  
  // ✅ Use URL as source of truth, fallback to initialVariant
  const variantKey = urlVariant || initialVariant || product.variants[0]?.key;
  const [previewVariantKey, setPreviewVariantKey] = useState<string | null>(null);

  // ✅ Handle variant changes - only update URL
  const handleVariantChange = (newVariant: string) => {
    router.replace(`?variant=${newVariant}`, { scroll: false });
  };

  // Active variant logic
  const activeVariant =
    product.variants.find(
      (v: any) => v.key === (previewVariantKey ?? variantKey)
    ) ?? product.variants[0];

  const selectedVariant =
    product.variants?.find((v: any) => v.key === variantKey) ||
    product.variants?.[0];

  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
      <div className="px-2">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-4 lg:gap-8 relative">
          <ProductImage variant={activeVariant} product={product} />

          <ProductEmiCartDescription variant={selectedVariant} product={product} setVariantKey={handleVariantChange} setPreviewVariantKey={setPreviewVariantKey} previewVariantKey={previewVariantKey} />
        </div>
        {/* Specs & Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specs">
            <TabsList className="w-full justify-start bg-transparent rounded-xl p-1">
              <TabsTrigger value="specs" className="rounded-lg py-3 text-[14px] px-4">Tech Specs</TabsTrigger>
              <TabsTrigger value="description" className="rounded-lg py-3 text-[14px] px-4">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg py-3 text-[14px] px-4">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-6 !bg-[#fff] rounded-lg">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {specs.map((s) => (
                      <div key={s.label} className="flex justify-between py-3 border-[#e5e7eb] border-b last:border-0">
                        <span className="text-sm !text-[#64748b]">{s.label}</span>
                        <span className="text-sm font-medium">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="description" className="mt-6 !bg-[#fff] rounded-lg">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 prose prose-sm max-w-none">
                  <p className="text-sm !text-[#64748b] leading-relaxed">
                    The BlendRas Portable Juicer is designed for the modern lifestyle. Whether you're at the gym, office, or traveling, this compact blender lets you prepare fresh smoothies, juices, protein shakes, and baby food in under 30 seconds. Equipped with 6 high-grade stainless steel blades and a powerful 22,000 RPM motor, it crushes ice and blends frozen fruits effortlessly. The USB Type-C fast charging ensures you're always ready to blend, while the BPA-free Tritan material keeps your drinks safe and fresh.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6 !bg-[#fff] rounded-lg">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center text-[#64748b]">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
                  <p className="font-semibold text-[hsl(222.2 84% 4.9%)] text-lg">4.8 out of 5</p>
                  <p className="text-sm !text-[#64748b]">Based on 2,400+ reviews</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}