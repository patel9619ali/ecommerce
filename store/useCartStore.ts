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
  addItem: (item: CartProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));
