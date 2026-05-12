import { create } from 'zustand';
import { getOrderPreview } from '../api/preview.api';

interface PreviewState {
  isOpen: boolean;
  selectedOrder: any | null;
  isLoading: boolean;
  openPreview: (orderId: string) => Promise<void>;
  closePreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  isOpen: false,
  selectedOrder: null,
  isLoading: false,
  
  openPreview: async (orderId: string) => {
    set({ isOpen: true, isLoading: true });
    try {
      const orderData = await getOrderPreview(orderId);
      set({ selectedOrder: orderData, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch order preview', error);
      set({ isLoading: false, selectedOrder: null });
    }
  },
  closePreview: () => set({ isOpen: false, selectedOrder: null }),
}));