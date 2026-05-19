import { create } from 'zustand';
import { executeWithdrawal, TransferResponse } from '../api/withdraw.api';

interface WithdrawState {
  isWithdrawing: boolean;
  error: string | null;
  successData: TransferResponse | null;
  processWithdrawal: () => Promise<void>;
  resetState: () => void;
}

export const useWithdrawStore = create<WithdrawState>((set) => ({
  isWithdrawing: false,
  error: null,
  successData: null,

  processWithdrawal: async () => {
    set({ isWithdrawing: true, error: null, successData: null });
    try {
      const response = await executeWithdrawal();
      set({ isWithdrawing: false, successData: response });
    } catch (error: unknown) {
      set({ error: 'Failed to process withdrawal.', isWithdrawing: false });
      throw error;
    }
  },

  resetState: () => set({ error: null, successData: null })
}));
