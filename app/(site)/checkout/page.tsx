// app/(site)/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CheckoutCart from "@/components/CheckoutCart/CheckoutCart";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, loadFromDatabase } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    if (status === "authenticated") {
      loadFromDatabase().finally(() => setLoading(false));
    }
  }, [status, loadFromDatabase, router]);

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push("/");
    }
  }, [items, loading, router]);

  if (loading || status === "loading") {
    return <div>Loading checkout...</div>;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return <CheckoutCart items={items} total={total} />;
}