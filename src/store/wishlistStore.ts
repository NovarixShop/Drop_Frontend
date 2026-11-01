import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { useAuthStore } from './authStore';

export interface WishlistItem {
  id: string; // The product _id or id
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  slug: string;
}

interface ServerWishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  isActive: boolean;
}

export interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  resetLocal: () => void;
  isInWishlist: (id: string) => boolean;
  syncWithServer: () => Promise<void>;
}

const toWishlistItems = (products: ServerWishlistProduct[]): WishlistItem[] =>
  products
    .filter((p) => p.isActive)
    .map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.images?.[0] || '',
      slug: p.slug,
    }));

const isSignedIn = () => useAuthStore.getState().isAuthenticated;

// Guests keep a local wishlist; once signed in, the server copy is the source of truth
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => {
      // Apply a change locally right away, then save it; undo the local change if the server rejects it
      const saveToServer = (request: () => Promise<unknown>, undo: () => void) => {
        if (!isSignedIn()) return;
        request().catch((err) => {
          console.error('Failed to update wishlist on the server', err);
          undo();
        });
      };

      const add = (item: WishlistItem) => {
        if (get().items.some((i) => i.id === item.id)) return;
        set((state) => ({ items: [...state.items, item] }));
        saveToServer(
          () => api.post('/wishlist', { productId: item.id }),
          () => set((state) => ({ items: state.items.filter((i) => i.id !== item.id) }))
        );
      };

      const remove = (id: string) => {
        const removed = get().items.find((i) => i.id === id);
        if (!removed) return;
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        saveToServer(
          () => api.delete(`/wishlist/${id}`),
          () => set((state) => ({ items: [...state.items, removed] }))
        );
      };

      return {
        items: [],
        addItem: add,
        removeItem: remove,
        toggleItem: (item) => (get().items.some((i) => i.id === item.id) ? remove(item.id) : add(item)),
        clearWishlist: () => {
          const previous = get().items;
          set({ items: [] });
          saveToServer(
            () => Promise.all(previous.map((i) => api.delete(`/wishlist/${i.id}`))),
            () => set({ items: previous })
          );
        },
        // Local only: used on sign-out so the next person on this device doesn't see the list
        resetLocal: () => set({ items: [] }),
        isInWishlist: (id) => get().items.some((i) => i.id === id),

        // On sign-in: upload anything saved as a guest, then take the merged server list
        syncWithServer: async () => {
          const res = await api.get('/wishlist');
          const serverIds = new Set(
            (res.data.data.wishlist.products as ServerWishlistProduct[]).map((p) => p._id)
          );

          for (const item of get().items) {
            if (!serverIds.has(item.id)) {
              // An inactive or deleted product is rejected; it just drops out of the merged list
              await api.post('/wishlist', { productId: item.id }).catch(() => {});
            }
          }

          const merged = await api.get('/wishlist');
          set({ items: toWishlistItems(merged.data.data.wishlist.products) });
        },
      };
    },
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
