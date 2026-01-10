"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

const EMI_OPTIONS = [
  { months: 3, interest: 0 },
  { months: 6, interest: 5 },
  { months: 12, interest: 10 },
];

export default function CheckoutPage() {
  const { items } = useCartStore();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="bg-[#000] text-white">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* ADDRESS */}
      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Delivery Address</h2>
        <p className="text-sm opacity-80">
          Mumbai, Maharashtra, India
        </p>
      </div>

      {/* EMI */}
      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">EMI Options</h2>
        {/* EMI radios */}
      </div>

      {/* ORDER SUMMARY */}
      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <p>Total: ₹ {total}</p>
      </div>

      {/* PAY */}
      <button className="w-full bg-green-600 py-3 rounded-lg font-semibold">
        Pay ₹ {total}
      </button>
    </div>
  );
}

