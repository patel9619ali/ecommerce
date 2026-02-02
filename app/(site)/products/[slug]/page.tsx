"use client";

import { PRODUCTS } from "@/data/products";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import ProductImage from "@/components/Product/ProductImage";
import ProductEmiCartDescription from "@/components/Product/ProductEmiCartDescription";

export default function ProductPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const editCart = searchParams.get("editCart") === "true";
  const variantFromUrl = searchParams.get("variant");

  const product = PRODUCTS.find(p => p.slug === slug);
  if (!product) return <div>Product not found</div>;

  const [variantKey, setVariantKey] = useState(
    variantFromUrl || product.variants[0].key
  );
  const [previewVariantKey, setPreviewVariantKey] = useState<string | null>(null);
  const activeVariant =
  product.variants.find(v => v.key === (previewVariantKey ?? variantKey))!;
  const [quantity, setQuantity] = useState(1);
  const { items } = useCartStore();

  useEffect(() => {
    if (!editCart) return;

    const item = items.find(
      i => i.slug === slug && i.variantKey === variantFromUrl
    );

    if (item) setQuantity(item.quantity);
  }, [editCart, items, slug, variantFromUrl]);

  const variant = product.variants.find(v => v.key === variantKey)!;
  useEffect(() => {
  router.replace(`?variant=${variantKey}`, { scroll: false });
}, [variantKey, router]);
  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
      <div className="px-2">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-4 lg:gap-8 relative">
          <ProductImage variant={activeVariant} product={product}/>
          <ProductEmiCartDescription  variant={variant} product={product} setVariantKey={setVariantKey} setPreviewVariantKey={setPreviewVariantKey} previewVariantKey={previewVariantKey}/>
        </div>
      </div>
    </section>
  );
};