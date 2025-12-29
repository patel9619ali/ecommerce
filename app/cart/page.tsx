"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

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
<></>
  );
}
