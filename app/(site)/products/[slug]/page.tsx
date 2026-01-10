"use client";

import { PRODUCTS } from "@/data/products";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import ProductImage from "@/components/Product/ProductImage";
import ProductEmiCartDescription from "@/components/Product/ProductEmiCartDescription";
import ProductCartAndCheckout from "@/components/Product/ProductCartAndCheckout";

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
    <section className="bg-[#000000cc] py-10">
      <div className="px-2">
        <div className="grid lg:grid-cols-[2fr_2fr_1fr] gap-3">
          <ProductImage variant={activeVariant} product={product}/>
          <ProductEmiCartDescription  variant={variant} product={product} setVariantKey={setVariantKey} setPreviewVariantKey={setPreviewVariantKey} previewVariantKey={previewVariantKey}/>
          <ProductCartAndCheckout variant={activeVariant} product={product}/>
        </div>
      </div>
    </section>
  );
};