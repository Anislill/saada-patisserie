import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, SEED_PRODUCTS } from '@/lib/firestore';

interface ProductStore {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: SEED_PRODUCTS,

      addProduct: (p) =>
        set((state) => ({ products: [...state.products, p] })),

      updateProduct: (p) =>
        set((state) => ({
          products: state.products.map((x) => (x.id === p.id ? p : x)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      toggleAvailability: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
          ),
        })),
    }),
    {
      name: 'saada-products',
      // Don't store video base64 in localStorage — too large; kept in memory only
      partialize: (state) => ({
        ...state,
        products: state.products.map(({ video: _v, ...rest }) => rest),
      }),
    }
  )
);
