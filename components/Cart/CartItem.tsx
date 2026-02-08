import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import type { CartProduct } from "@/store/useCartStore";

interface CartItemProps {
  item: CartProduct;
  index: number;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove, index }: CartItemProps) => {
  console.log(item,"itemitem")
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -120, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="group bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] shadow-sm rounded-2xl p-3 md:p-5 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(252_80%_60%/0.12),0_2px_8px_-2px_hsl(240_15%_10%/0.04)] relative"
    >
      {/* Remove */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[hsl(240_8%_93%/0.8)] flex items-center justify-center text-[hsl(240_8%_45%)] hover:bg-[hsl(0_72%_55%)] hover:text-white transition-all cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex gap-3 md:gap-5">
        {/* Image */}
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden bg-[hsl(240_8%_93%)]">
          <img
            src={item?.image}
            alt={item?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between pr-6">
          <h3 className="font-['Space_Grotesk'] text-sm md:text-lg font-bold truncate text-[#000]">
            {item.title}
          </h3>

          <div className="flex justify-between items-center mt-3">
            {/* Quantity */}
            <div className="flex items-center bg-[hsl(240_10%_95%)] rounded-full p-0.5">
              <button
                onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
                className="w-7 h-7 rounded-full hover:bg-[hsl(252_80%_60%)] hover:text-white text-[#000] cursor-pointer group2"
              >
                <Minus className="w-3 h-3 mx-auto text-[#000] group2-hover:text-[#fff]" />
              </button>

              <span className="w-8 text-center font-bold text-sm text-[#000]">
                {item.quantity}
              </span>

              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-7 h-7 rounded-full hover:bg-[hsl(252_80%_60%)] group2 text-[#000] cursor-pointer"
              >
                <Plus className="w-3 h-3 mx-auto text-[#000] group2-hover:text-[#fff]" />
              </button>
            </div>

            {/* Price */}
            <p className="font-bold text-sm md:text-xl text-[#000]">
              ₹ {(item.price * item.quantity).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
