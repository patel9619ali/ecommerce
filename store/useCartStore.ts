import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartProduct = {
  id: string;
  productId: string;
  slug?: string;
  brandSlug?: string;
  categorySlug?: string;
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

function mergeCartItems(localItems: CartProduct[], dbItems: CartProduct[]): CartProduct[] {
  const map = new Map<string, CartProduct>();

  for (const item of dbItems) {
    const key = `${item.productId}::${item.variantKey}`;
    map.set(key, { ...item, id: item.id || crypto.randomUUID() });
  }

  for (const item of localItems) {
    const key = `${item.productId}::${item.variantKey}`;
    const existing = map.get(key);

    if (existing) {
      map.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        title: existing.title || item.title,
        slug: existing.slug || item.slug,
        brandSlug: existing.brandSlug || item.brandSlug,
        categorySlug: existing.categorySlug || item.categorySlug,
        image: existing.image || item.image,
      });
    } else {
      map.set(key, { ...item, id: item.id || crypto.randomUUID() });
    }
  }

  return Array.from(map.values());
}

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

    const { hydrated, items, userId } = get();
    if (!hydrated || !userId) return;

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

        const currentUserId = get().userId;

        // Different signed-in user: clear persisted cart first
        if (currentUserId && currentUserId !== userId) {
          set({ items: [], userId, hydrated: false });
        }

        isLoadingFromDB = true;

        try {
          const res = await fetch("/api/cart/get");
          const { cart } = await res.json();

          const dbItems: CartProduct[] = (cart?.items || []).map((i: {
            productId: string;
            variantId: string;
            slug?: string | null;
            brandSlug?: string | null;
            categorySlug?: string | null;
            title?: string;
            price: number;
            image: string;
            quantity: number;
          }) => ({
            id: crypto.randomUUID(),
            productId: i.productId,
            variantKey: i.variantId,
            slug: i.slug,
            brandSlug: i.brandSlug,
            categorySlug: i.categorySlug,
            title: i.title,
            price: i.price,
            image: i.image,
            quantity: i.quantity,
            mrp: i.price,
          }));

          const localItems = get().items;
          const mergedItems = mergeCartItems(localItems, dbItems);

          set({
            items: mergedItems,
            userId,
            hydrated: true,
          });

          // Push guest+db merged cart back to DB after login
          get().syncWithDatabase();
        } catch (error) {
          console.error("Cart load failed:", error);
          set({ userId, hydrated: true });
        } finally {
          isLoadingFromDB = false;
        }
      },

      resetCart: () => {
        set(() => ({
          items: [],
          isCartOpen: false,
          userId: null,
          hydrated: true,
        }));
        
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
