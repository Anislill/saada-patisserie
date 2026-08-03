import { create } from 'zustand';
import {
  Product,
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedFirestoreIfEmpty,
} from '@/lib/firestore';

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: true,
  error: null,

  addProduct: async (p) => {
    await saveProductToFirestore(p);
    // state updates automatically via onSnapshot
  },

  updateProduct: async (p) => {
    await saveProductToFirestore(p);
  },

  deleteProduct: async (id) => {
    await deleteProductFromFirestore(id);
  },

  toggleAvailability: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    await saveProductToFirestore({ ...product, isAvailable: !product.isAvailable });
  },
}));

// ── Start real-time Firestore subscription immediately on module load ──
let _seeded = false;

subscribeToProducts(
  (products) => {
    useProductStore.setState({ products, isLoading: false, error: null });
    // Seed only once, only when Firestore collection is empty
    if (products.length === 0 && !_seeded) {
      _seeded = true;
      seedFirestoreIfEmpty().catch(console.error);
    }
  },
  (err) => {
    console.error('[productStore] Firestore error:', err);
    useProductStore.setState({ isLoading: false, error: err.message });
  }
);
