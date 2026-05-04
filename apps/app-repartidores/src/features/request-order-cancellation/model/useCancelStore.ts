import { create } from 'zustand';
import { requestOrderCancellation } from '../api/cancel.api';
import { CancelOrderRequest } from '../../../entities/support/model/types';

interface CancelState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submitCancellation: (payload: CancelOrderRequest) => Promise<void>;
  resetState: () => void;
}

export const useCancelStore = create<CancelState>((set) => ({
  isSubmitting: false,
  isSuccess: false,
  error: null,
  submitCancellation: async (payload) => {
    set({ isSubmitting: true, error: null, isSuccess: false });
    try {
      await requestOrderCancellation(payload);
      set({ isSubmitting: false, isSuccess: true });
    } catch (error: unknown) {
      set({ isSubmitting: false, error: 'Failed to request cancellation.' });
      throw error;
    }
  },
  resetState: () => set({ isSubmitting: false, isSuccess: false, error: null })
}));
