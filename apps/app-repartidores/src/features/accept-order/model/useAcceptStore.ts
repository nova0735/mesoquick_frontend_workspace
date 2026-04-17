import { create } from 'zustand';
import { acceptOrder } from '../api/accept.api';
import { PackageTimer } from '../../../shared/lib/packageTimer';

interface AcceptState {
  isAccepting: boolean;
  error: string | null;
  takeOrder: (orderId: string) => Promise<void>;
}

export const useAcceptStore = create<AcceptState>((set) => ({
  isAccepting: false,
  error: null,
  
  takeOrder: async (orderId: string) => {
    set({ isAccepting: true, error: null });
    try {
      await acceptOrder(orderId);
      PackageTimer.clear(orderId);
      set({ isAccepting: false });
    } catch (error: any) {
      set({ isAccepting: false, error: error.response?.data?.message || 'Failed to accept order.' });
    }
  },
}));