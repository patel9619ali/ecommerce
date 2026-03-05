"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { BuyCartSection } from "./BuyCartSection";
import { Product } from "@/data/types";

type Props = {
  productData?: Product[];
  featuredProductSlug?: string;
};

export const MainImageAddToCart = ({ productData, featuredProductSlug }: Props) => {
  const product = useMemo(() => {
    if (!productData?.length) return null;

    if (featuredProductSlug) {
      const bySlug = productData.find((p) => p.slug === featuredProductSlug);
      if (bySlug) return bySlug;
    }

    const juicerProduct = productData.find((p) => {
      const text = `${p.title || ""} ${p.category?.name || ""}`.toLowerCase();
      return text.includes("juicer");
    });

    return juicerProduct || productData[0];
  }, [productData, featuredProductSlug]);

  const [variantKey, setVariantKey] = useState<string | null>(product?.variant?.[0]?.sku ?? null);

  const selectedVariant =
    product?.variant?.find((v) => v.sku === variantKey) || product?.variant?.[0];

  if (!product || !selectedVariant) return null;

  return (
    <section className="w-full bg-[#fff] py-14">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-[2.5fr_1.5fr]">
          <ProductGallery variant={selectedVariant} product={product} />
          <BuyCartSection
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={setVariantKey}
          />
        </div>
      </div>
    </section>
  );
};
