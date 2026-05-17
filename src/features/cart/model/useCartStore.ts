import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@shared/types';
import type { CartState } from './cart.types';

interface CartStore extends CartState {
  // Acciones
  addItem: (product: Product, businessId: string, businessName: string, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;

  // Selectores computados
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      currentBusinessId: null,
      currentBusinessName: null,

      addItem: (product, businessId, businessName, quantity = 1, notes) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          const newItem: CartItem = { product, quantity, notes };
          return {
            items: [...state.items, newItem],
            currentBusinessId: businessId,
            currentBusinessName: businessName,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.product.id !== productId);
          return {
            items: newItems,
            currentBusinessId: newItems.length === 0 ? null : state.currentBusinessId,
            currentBusinessName: newItems.length === 0 ? null : state.currentBusinessName,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      updateNotes: (productId, notes) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, notes } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], currentBusinessId: null, currentBusinessName: null });
      },

      totalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },
    }),
    {
      name: 'mesoquick-cart',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir los datos, no las funciones
      partialize: (state) => ({
        items: state.items,
        currentBusinessId: state.currentBusinessId,
        currentBusinessName: state.currentBusinessName,
      }),
    }
  )
);
