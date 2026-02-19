import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WishlistProduct = {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
  colorName?: string;
  colorHex?: string;
};

type WishlistState = {
  items: WishlistProduct[];
  hydrated: boolean;
  userId: string | null;

  addItem: (item: WishlistProduct) => void;
  removeItem: (productId: string, variantId: string) => void;
  isInWishlist: (productId: string, variantId: string) => boolean;
  loadFromDatabase: (userId: string) => Promise<void>;
  syncWithDatabase: () => void;
  resetWishlist: () => void;
};

let syncTimeout: NodeJS.Timeout | null = null;
let isLoadingFromDB = false;

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      userId: null,

      addItem: (item) => {
        set((state) => {
          const exists = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (exists) {
            return state; // Already in wishlist
          }

          return {
            items: [...state.items, { ...item, id: crypto.randomUUID() }],
          };
        });

        get().syncWithDatabase();
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));

        get().syncWithDatabase();
      },

      isInWishlist: (productId, variantId) => {
        return get().items.some(
          (i) => i.productId === productId && i.variantId === variantId
        );
      },

      syncWithDatabase: () => {
        if (syncTimeout) clearTimeout(syncTimeout);

        syncTimeout = setTimeout(async () => {
          if (isLoadingFromDB) return;

          const { hydrated, items } = get();
          if (!hydrated) return;

          try {
            await fetch("/api/wishlist/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
          } catch (e) {
            console.error("Wishlist sync failed", e);
          }
        }, 400);
      },

      loadFromDatabase: async (userId: string) => {
        if (!userId || isLoadingFromDB) return;

        const currentUserId = get().userId;

        // Different user? Clear wishlist
        if (currentUserId && currentUserId !== userId) {
          set({ items: [], userId, hydrated: false });
        }

        isLoadingFromDB = true;

        try {
          const res = await fetch("/api/wishlist/get");
          const { wishlist } = await res.json();

          if (wishlist?.items?.length) {
            set({
              items: wishlist.items.map((i: any) => ({
                id: crypto.randomUUID(),
                productId: i.productId,
                variantId: i.variantId,
                slug: i.slug,
                title: i.title,
                price: i.price,
                mrp: i.mrp,
                image: i.image,
                colorName: i.colorName,
                colorHex: i.colorHex,
              })),
              userId,
              hydrated: true,
            });
          } else {
            // Keep localStorage items if DB is empty
            const currentItems = get().items;
            if (currentItems.length > 0) {
              set({ userId, hydrated: true });
              get().syncWithDatabase();
            } else {
              set({ items: [], userId, hydrated: true });
            }
          }
        } catch (e) {
          console.error("Wishlist load failed:", e);
          set({ hydrated: true });
        } finally {
          isLoadingFromDB = false;
        }
      },

      resetWishlist: () => {
        set({
          items: [],
          userId: null,
          hydrated: true,
        });
        get().syncWithDatabase();
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        hydrated: state.hydrated,
        userId: state.userId,
      }),
      onRehydrateStorage: () => {
        return async (state) => {
          if (!state) return;

          state.hydrated = true;

          try {
            const res = await fetch("/api/auth/session");
            const session = await res.json();

            if (session?.user?.id) {
              if (state.userId && state.userId !== session.user.id) {
                state.items = [];
              }
              await state.loadFromDatabase(session.user.id);
            } else {
              state.items = [];
              state.userId = null;
            }
          } catch (e) {
            console.error("Session check failed:", e);
          }
        };
      },
    }
  )
);