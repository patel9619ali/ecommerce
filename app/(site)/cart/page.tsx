"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (!items.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
      </div>
    );
  }

  return (
<>
{items.map(item => (
  <Link
    key={item.id}
    href={`/products/${item.slug}?variant=${item.variantKey}&editCart=true`}
  >
    <h3>{item.title}</h3>
    <p>{item.variantKey}</p>
  </Link>
))}
</>
  );
}
