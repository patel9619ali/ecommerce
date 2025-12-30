"use client";

import { PRODUCTS } from "@/data/products";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import ProductImage from "@/components/Product/ProductImage";

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
  console.log(product,"productproduct")
  return (
    <section className="bg-[#000] container-fluid px-2">
      <ProductImage />
    </section>
  );
}
