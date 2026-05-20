import { create } from 'zustand';

interface ActiveOrderState {
  activeOrder: any | null;
  setActiveOrder: (order: any) => void;
  clearOrder: () => void;
}

export const useActiveOrderStore = create<ActiveOrderState>((set) => ({
  activeOrder: null,
  setActiveOrder: (order) => set({ activeOrder: order }),
  clearOrder: () => set({ activeOrder: null }),
}));