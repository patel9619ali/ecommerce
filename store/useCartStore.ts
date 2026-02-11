import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartProduct = {
  id: string;
  productId: string;
  slug?: string;
  title?: string;
  variantKey: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartProduct[];

  // 🔹 UI ONLY (NOT persisted)
  isCartOpen: boolean;

  hydrated: boolean;
  userId: string | null;

  openCart: () => void;
  closeCart: () => void;

  addItem: (item: CartProduct, openCart?: boolean) => void;
  removeItem: (productId: string, variantKey: string) => void;
  updateQuantity: (productId: string, variantKey: string, qty: number) => void;

  loadFromDatabase: (userId: string) => Promise<void>;
  syncWithDatabase: () => void;
  resetCart: () => void;
};

let syncTimeout: NodeJS.Timeout | null = null;
let isLoadingFromDB = false;
let currentSyncVersion = 0;
export const useCartStore = create<CartState>()(
  
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false, // 👈 UI-only

      hydrated: false,
      userId: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (item, openCart = true) => {
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
              isCartOpen: openCart, // ✅ open sheet
            };
          }

          return {
            items: [...state.items, { ...item, id: crypto.randomUUID() }],
            isCartOpen: openCart, // ✅ open sheet
          };
        });

        get().syncWithDatabase();
      },

updateQuantity: (productId, variantKey, qty) => {
  if (qty < 1) return;

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

  const myVersion = ++currentSyncVersion;

  syncTimeout = setTimeout(async () => {
    if (isLoadingFromDB) return;

    const { hydrated, items } = get();
    if (!hydrated) return;

    try {
      await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, version: myVersion }),
      });
    } catch (e) {
      console.error("Cart sync failed", e);
    }
  }, 400);
},


      loadFromDatabase: async (userId: string) => {
        if (!userId || isLoadingFromDB) return;

        isLoadingFromDB = true;

        try {
          const res = await fetch("/api/cart/get");
          const { cart } = await res.json();

          if (cart?.items?.length) {
            set({
              items: cart.items.map((i: any) => ({
                id: crypto.randomUUID(),
                productId: i.productId,
                variantKey: i.variantId,
                slug: i.slug,
                title: i.title,
                price: i.price,
                image: i.image,
                quantity: i.quantity,
                mrp: i.price,
              })),
              userId,
              hydrated: true,
            });
          } else {
            set({ items: [], userId, hydrated: true });
          }
        } finally {
          isLoadingFromDB = false;
        }
      },

      resetCart: () => {
        set({
          items: [],
          isCartOpen: false, // 👈 close UI
          userId: null,
          hydrated: true,
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),

      // 🚨 THIS IS THE KEY FIX
      partialize: (state) => ({
        items: state.items,
        hydrated: state.hydrated,
        userId: state.userId,
        // ❌ isCartOpen NOT persisted
      }),
    }
  )
);
