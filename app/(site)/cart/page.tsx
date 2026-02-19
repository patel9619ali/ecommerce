"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence,motion } from "framer-motion";
import CartHeader from "@/components/Cart/CartHeader";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import EmptyCart from "@/components/Cart/EmptyCart";
import MobileCheckoutBar from "@/components/Cart/MobileCheckoutBar";
import CartSkeleton from "@/components/CartSkeleton";
import { useLoading } from "@/context/LoadingContext";
import { ArrowRight } from "lucide-react";

export default function CartPage() {
    const { setLoading } = useLoading();
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
  const handleCheckout = () => {
    setLoading(true); // 🔥 start global loader
    router.push("/checkout");
  };
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

      

      <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      <div className="bg-[hsl(0_0%_100%/0.95)] backdrop-blur-xl border-t border-[hsl(240_10%_90%/0.5)] px-4 py-3 shadow-[0_10px_40px_-8px_hsl(252_80%_60%/0.18),0_4px_16px_-4px_hsl(240_15%_10%/0.06)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-[hsl(240_8%_45%)] uppercase tracking-wider">
              Total ({totalItems} {totalItems === 1 ? "item" : "items"})
            </p>
            <p className="text-xl font-bold text-[hsl(240_15%_10%)]">
              ₹{total.toLocaleString()}
            </p>
          </div>
          <button onClick={handleCheckout} className="bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] hover:scale-[1.02] active:scale-[0.98] text-[hsl(0_0%_100%)] font-bold text-sm rounded-xl px-6 h-12 shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] transition-all duration-300 group flex-shrink-0 flex items-center gap-1.5">
            Checkout
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
    </div>
  );
}
