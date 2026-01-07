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
    <section className="bg-[#000]">
      <div className="px-2 container">
        <div className="grid md:grid-cols-[2fr_2fr]">
          <ProductImage variant={variant} product={product}/>
          <ProductEmiCartDescription  variant={variant} product={product}/>
        </div>
      </div>
    </section>
  );
};