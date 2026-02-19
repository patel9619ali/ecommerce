import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

const CartHeader = ({ itemCount }: CartHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-6 md:mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] flex items-center justify-center shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)]">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[hsl(0_0%_100%)]" />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[hsl(240_15%_10%)] tracking-tight">
            My Cart
          </h1>
          <p className="text-[hsl(240_8%_45%)] text-xs md:text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartHeader;
