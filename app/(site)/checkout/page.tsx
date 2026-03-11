// app/(site)/checkout/page.tsx
"use client";

import { useEffect } from "react";
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
  const successRedirectKey = "checkout_success_redirect";

  useEffect(() => {
    setLoading(true);

    if (status === "unauthenticated") {
      router.push("/sign-in?callbackUrl=/checkout");
      return;
    }

    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router, setLoading]);

  useEffect(() => {
    if (status === "authenticated" && items.length === 0) {
      const redirectTarget =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem(successRedirectKey)
          : null;

      if (redirectTarget) {
        window.sessionStorage.removeItem(successRedirectKey);
        router.replace(redirectTarget);
        return;
      }

      router.push("/");
    }
  }, [items, status, router]);

  if (status === "loading") return null;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CheckoutCart
      items={items}
      itemCount={totalItems}
    />
  );
}
