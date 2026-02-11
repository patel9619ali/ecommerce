"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";

import CartHeader from "@/components/Cart/CartHeader";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import EmptyCart from "@/components/Cart/EmptyCart";
import MobileCheckoutBar from "@/components/Cart/MobileCheckoutBar";
import CartSkeleton from "@/components/CartSkeleton";

export default function CartPage() {
  const router = useRouter();
  const { status } = useSession();

  const { items, updateQuantity, removeItem, hydrated } = useCartStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/cart");
    }
  }, [status, router]);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
        <CartSkeleton />
      </main>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10">
        <CartHeader itemCount={totalItems} />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdateQuantity={(qty) =>
                      updateQuantity(item.productId, item.variantKey, qty)
                    }
                    onRemove={() =>
                      removeItem(item.productId, item.variantKey)
                    }
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1 pb-24 lg:pb-0">
              <CartSummary
                subtotal={subtotal}
                itemCount={totalItems}
              />
            </div>
          </div>
        )}
      </main>

      <MobileCheckoutBar total={total} itemCount={totalItems} />
    </div>
  );
}
