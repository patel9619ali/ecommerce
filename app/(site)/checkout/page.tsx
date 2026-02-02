"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import CheckoutCart from "@/components/CheckoutCart/CheckoutCart";

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
    <CheckoutCart/>
  );
}

