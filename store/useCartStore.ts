import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCT_VARIANTS } from "@/components/MainImageAddToCart/productVariants";

export type CartProduct = {
  id: string;            // productId-variantKey
  productId: string;
  slug: string;
  title: string;
  variantKey: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartProduct[];
  isCartOpen: boolean;
  hydrated: boolean;

  addItem: (item: CartProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;

  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,
      hydrated: false,

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.id === item.id && i.variantKey === item.variantKey
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.variantKey === item.variantKey
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isCartOpen: true,
            };
          }

          return {
            items: [...state.items, item],
            isCartOpen: true,
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          isCartOpen: state.items.length > 1,
        })),

      clearCart: () => set({ items: [], isCartOpen: false }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
