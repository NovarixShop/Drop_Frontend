import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

export interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(
          i => i.id === item.id && (i.size || '') === (item.size || '') && (i.color || '') === (item.color || '')
        );
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i === existingItem ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id, size, color) => set((state) => ({
        items: state.items.filter(i => {
          if (size !== undefined || color !== undefined) {
            return !(i.id === id && (i.size || '') === (size || '') && (i.color || '') === (color || ''));
          }
          return i.id !== id;
        })
      })),
      updateQuantity: (id, quantity, size, color) => set((state) => ({
        items: state.items.map(i => {
          const match = size !== undefined || color !== undefined
            ? i.id === id && (i.size || '') === (size || '') && (i.color || '') === (color || '')
            : i.id === id;
          return match ? { ...i, quantity } : i;
        })
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not isCartOpen
    }
  )
);
