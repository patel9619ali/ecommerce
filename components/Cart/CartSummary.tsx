import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, ArrowRight, Gift, Tag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

const FREE_SHIPPING_THRESHOLD = 500;

const CartSummary = ({ subtotal, itemCount }: CartSummaryProps) => {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] shadow-sm rounded-2xl p-5 md:p-7 sticky top-24"
    >
      <h2 className="text-xl md:text-2xl font-bold text-[hsl(240_15%_10%)] mb-5">
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      <div className="mb-5 p-3 rounded-xl bg-[hsl(240_10%_95%/0.6)]">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4 text-[hsl(252_80%_60%)]" />
          {shipping === 0 ? (
            <span className="text-xs font-semibold text-[hsl(152_65%_45%)]">
              🎉 You've unlocked free shipping!
            </span>
          ) : (
            <span className="text-xs font-medium text-[hsl(240_8%_45%)]">
              Add <span className="font-bold text-[hsl(240_15%_10%)]">${amountToFreeShipping.toFixed(2)}</span> more for free shipping
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-[hsl(240_8%_93%)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))]"
            initial={{ width: 0 }}
            animate={{ width: `${shippingProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Promo Code */}
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(240_8%_45%)]" />
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm rounded-xl bg-[hsl(240_10%_95%)] text-[hsl(240_15%_20%)] placeholder:text-[hsl(240_8%_45%)] border-0 outline-none focus:ring-2 focus:ring-[hsl(252_80%_60%)] transition-shadow "
          />
        </div>
        <button className="h-10 px-4 text-xs font-bold rounded-xl bg-[hsl(240_15%_10%)] text-[hsl(240_10%_98%)] hover:opacity-90 transition-all duration-200">
          Apply
        </button>
      </div>

      {/* Line Items */}
      <div className="space-y-2.5 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(240_8%_45%)] ">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold text-[hsl(240_15%_10%)]">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(240_8%_45%)] ">Shipping</span>
          <span className="font-semibold text-[hsl(240_15%_10%)]">
            {shipping === 0 ? (
              <span className="text-[hsl(152_65%_45%)]">Free</span>
            ) : (
              `₹${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(240_8%_45%)] ">Tax</span>
          <span className="font-semibold text-[hsl(240_15%_10%)]">₹{tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[hsl(240_10%_90%)] mb-4" />

      {/* Total */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-base font-bold text-[hsl(240_15%_10%)]">Total</span>
        <span className="text-2xl font-bold text-[hsl(240_15%_10%)]">
          ₹{total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <button onClick={() => router.push('/checkout')}
        className="w-full h-13 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] text-[hsl(0_0%_100%)] font-bold text-sm md:text-base rounded-xl shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] hover:shadow-[0_10px_40px_-8px_hsl(252_80%_60%/0.18),0_4px_16px_-4px_hsl(240_15%_10%/0.06)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2 py-3 cursor-pointer"
      >
        Checkout
        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Trust Badges */}
      <div className="mt-5 pt-4 border-t border-[hsl(240_10%_90%)]">
        <div className="flex items-center justify-center gap-5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[hsl(252_80%_60%)]" />
            <span className="text-[10px] font-medium text-[hsl(240_8%_45%)]">Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[hsl(16_90%_58%)]" />
            <span className="text-[10px] font-medium text-[hsl(240_8%_45%)]">Gift Wrap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-[hsl(152_65%_45%)]" />
            <span className="text-[10px] font-medium text-[hsl(240_8%_45%)]">30-Day Returns</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
