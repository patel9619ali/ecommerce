import { create } from "zustand";
import { PRODUCT_VARIANTS } from "@/components/MainImageAddToCart/productVariants";
export type CartProduct = {
  id: string;              // productId
  title: string;
  variantKey: keyof typeof PRODUCT_VARIANTS;
  price: number;
  image: string;           // resolved image
  quantity: number;
};

type CartState = {
  items: CartProduct[];

  // UI state
  isCartOpen: boolean;

  // actions
  addItem: (item: CartProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  openCart: () => void;
  closeCart: () => void;
};


export const useCartStore = create<CartState>((set) => ({
  items: [],
isCartOpen: false,
  addItem: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
        isCartOpen: true,
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      
      ),
    })),

 removeItem: (id) =>
    set((state) => {
      const updated = state.items.filter((i) => i.id !== id);
      return {
        items: updated,
        isCartOpen: updated.length > 0,
      };
    }),

  clearCart: () => set({ items: [] }),
  
  closeCart: () => set({ isCartOpen: false }),
  openCart: () => set({ isCartOpen: true }),
}));
