import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
    >
      <motion.div
        className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[linear-gradient(135deg,#6847eb,#f46734)] flex items-center justify-center mb-6 shadow-[0_8px_30px_-6px_#6847eb59,0_4px_12px_-4px_#f4673426]"
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <ShoppingBag className="w-9 h-9 md:w-10 md:h-10 text-[#fff]" />
      </motion.div>
      <h2 className="font-display text-xl md:text-2xl font-bold text-[#16161d] mb-2">
        Your cart is empty
      </h2>
      <p className="text-[#6a6a7c] text-sm mb-8 max-w-xs">
        Discover amazing products and add them to your cart to get started!
      </p>
      <Button className="bg-[linear-gradient(135deg,#6847eb,#f46734)] text-[#fff] font-display font-bold rounded-xl px-8 h-12 shadow-vibrant hover:[shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.12),0_2px_8px_-2px_hsl(var(--foreground)/0.04)]] transition-all duration-300 hover:scale-[1.02] group">
        Start Shopping
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default EmptyCart;
