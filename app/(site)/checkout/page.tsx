// app/(site)/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CheckoutCart from "@/components/CheckoutCart/CheckoutCart";
import { useLoading } from "@/context/LoadingContext";
export default function CheckoutPage() {
  const { status } = useSession();
  const { items } = useCartStore();
  const { setLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router, setLoading]);

  useEffect(() => {
    if (status === "authenticated" && items.length === 0) {
      router.push("/");
    }
  }, [items, status, router]);

  if (status === "loading") return null;

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CheckoutCart
      items={items}
      total={total}
      itemCount={totalItems}
    />
  );
}
