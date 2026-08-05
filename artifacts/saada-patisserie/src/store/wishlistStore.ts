import { create } from 'zustand';

/**
 * Per-user wishlist store.
 *
 * Each user's wishlist is persisted in localStorage under a key that includes
 * their UID: `saada-wishlist-<uid>`.  When the user logs out (uid = null) the
 * in-memory list is cleared immediately so it never bleeds into another session.
 *
 * Call `loadForUser(uid | null)` from the global auth listener every time the
 * Firebase user changes.
 */

interface WishlistStore {
  productIds: string[];
  currentUid: string | null;
  /** Must be called by the auth listener on every user change (login / logout). */
  loadForUser: (uid: string | null) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

function storageKey(uid: string) {
  return `saada-wishlist-${uid}`;
}

function readFromStorage(uid: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(uid: string, ids: string[]): void {
  try {
    localStorage.setItem(storageKey(uid), JSON.stringify(ids));
  } catch { /* storage full — silently ignore */ }
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  productIds: [],
  currentUid: null,

  loadForUser: (uid) => {
    if (!uid) {
      // Logged out — wipe in-memory list; leave each user's localStorage intact
      set({ productIds: [], currentUid: null });
      return;
    }
    set({ productIds: readFromStorage(uid), currentUid: uid });
  },

  toggleItem: (id) => {
    const { currentUid, productIds } = get();
    if (!currentUid) return; // not logged in — ignore
    const next = productIds.includes(id)
      ? productIds.filter((p) => p !== id)
      : [...productIds, id];
    writeToStorage(currentUid, next);
    set({ productIds: next });
  },

  hasItem: (id) => get().productIds.includes(id),
}));
