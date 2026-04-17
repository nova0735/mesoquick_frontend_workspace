import { create } from 'zustand';
import { updateStatus } from '../api/status.api';

interface StatusUpdateState {
  isUpdating: boolean;
  error: string | null;
  changeStatus: (orderId: string, newStatus: string) => Promise<void>;
}

export const useStatusUpdateStore = create<StatusUpdateState>((set) => ({
  isUpdating: false,
  error: null,
  
  changeStatus: async (orderId: string, newStatus: string) => {
    set({ isUpdating: true, error: null });
    try {
      await updateStatus(orderId, newStatus);
      set({ isUpdating: false });
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      set({ isUpdating: false, error: error?.message || 'Failed to update status.' });
    }
  },
}));