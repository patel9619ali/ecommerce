import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartProduct = {
  id: string; // UI only
  productId: string;
  slug?: string;
  title?: string;
  description?: string;
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
  removeItem: (productId: string, variantKey: string) => void;
  updateQuantity: (productId: string, variantKey: string, qty: number) => void;
  syncWithDatabase: () => void;
  loadFromDatabase: () => Promise<void>;
  resetCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

let syncTimeout: NodeJS.Timeout | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      hydrated: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.variantKey === item.variantKey
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                i.variantKey === item.variantKey
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
        });

        get().syncWithDatabase();
      },

      updateQuantity: (productId, variantKey, qty) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantKey === variantKey
              ? { ...i, quantity: qty }
              : i
          ),
        }));

        get().syncWithDatabase();
      },

      removeItem: (productId, variantKey) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && i.variantKey === variantKey)
          ),
        }));

        get().syncWithDatabase();
      },

      syncWithDatabase: () => {
        if (syncTimeout) clearTimeout(syncTimeout);

        syncTimeout = setTimeout(async () => {
          try {
            await fetch("/api/cart/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: get().items }),
            });
          } catch (err) {
            console.error(err);
          }
        }, 400);
      },

      loadFromDatabase: async () => {
        const res = await fetch("/api/cart/get");
        const { cart } = await res.json();
        console.log(cart,"cartcartcartcart")
        if (cart?.items) {
          set({
            items: cart.items.map((i: any) => ({
              id: crypto.randomUUID(),
              productId: i.productId,
              slug: i.slug,              // ✅ FIX
              variantKey: i.variantId,
              title: i.title,
              description: i.description,
              price: i.price,
              image: i.image,
              quantity: i.quantity,
            })),
          });
        }
      },


      resetCart: () => set({ items: [], isCartOpen: false }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => async (state) => {
  if (!state) return;

  state.hydrated = true;

  // 🔥 Drop invalid items (no slug)
  state.items = state.items.filter((i) => !!i.slug);

  try {
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user) {
      await state.loadFromDatabase();
    }
  } catch (e) {
    console.error("Session check failed", e);
  }
}
    }
  )
);
