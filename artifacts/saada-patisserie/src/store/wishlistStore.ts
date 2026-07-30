import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  productIds: string[];
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggleItem: (id) => set((state) => {
        if (state.productIds.includes(id)) {
          return { productIds: state.productIds.filter((pId) => pId !== id) };
        }
        return { productIds: [...state.productIds, id] };
      }),
      hasItem: (id) => get().productIds.includes(id),
    }),
    {
      name: 'saada-wishlist',
    }
  )
);
