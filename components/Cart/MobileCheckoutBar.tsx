import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
interface MobileCheckoutBarProps {
  total: number;
  itemCount: number;
  onPayClick: () => void; // ✅ Callback to trigger payment
  addressSaved: boolean; // ✅ To show different states
  paymentMethod: string;
}

const MobileCheckoutBar = ({ total, itemCount, onPayClick, addressSaved, paymentMethod   }: MobileCheckoutBarProps) => {
  if (itemCount === 0) return null;

  return (
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
              Total ({itemCount} {itemCount === 1 ? "item" : "items"})
            </p>
            <p className="text-xl font-bold text-[hsl(240_15%_10%)]">
              ₹{total.toLocaleString()}
            </p>
          </div>
          <button 
            onClick={onPayClick}
            disabled={!addressSaved}
            className={`${
              addressSaved
                ? "bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-300 cursor-not-allowed"
            } text-[hsl(0_0%_100%)] font-bold text-sm rounded-xl px-6 h-12 shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] transition-all duration-300 group flex-shrink-0 flex items-center gap-1.5`}
          >
            <Lock className="w-3.5 h-3.5" />
            {paymentMethod === "cod" ? `Order ₹${total.toLocaleString()}` : `Pay ₹${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileCheckoutBar;
