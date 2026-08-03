import { create } from 'zustand';
import {
  Coupon,
  subscribeToCoupons,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  toggleCouponInFirestore,
} from '@/lib/firestore';

interface PromoState {
  coupons: Coupon[];
  isLoading: boolean;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCoupon: (id: string, active: boolean) => Promise<void>;
}

export const usePromoStore = create<PromoState>((set, get) => ({
  coupons: [],
  isLoading: true,

  addCoupon: async (data) => {
    const coupon: Coupon = { id: `c${Date.now()}`, ...data };
    // Optimistic update
    set((s) => ({ coupons: [...s.coupons, coupon] }));
    await saveCouponToFirestore(coupon);
  },

  deleteCoupon: async (id) => {
    set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) }));
    await deleteCouponFromFirestore(id);
  },

  toggleCoupon: async (id, active) => {
    set((s) => ({
      coupons: s.coupons.map((c) => (c.id === id ? { ...c, active } : c)),
    }));
    await toggleCouponInFirestore(id, active);
  },
}));

// ── Real-time Firestore subscription ──
subscribeToCoupons(
  (coupons) => usePromoStore.setState({ coupons, isLoading: false }),
  () => usePromoStore.setState({ isLoading: false })
);
