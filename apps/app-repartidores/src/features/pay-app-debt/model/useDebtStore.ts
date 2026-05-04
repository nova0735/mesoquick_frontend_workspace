import { create } from 'zustand';
import { payPendingDebt, PayPendingRequest } from '../api/debt.api';

interface DebtState {
  isPaying: boolean;
  error: string | null;
  payDebt: (payload: PayPendingRequest) => Promise<void>;
}

export const useDebtStore = create<DebtState>((set) => ({
  isPaying: false,
  error: null,

  payDebt: async (payload: PayPendingRequest) => {
    set({ isPaying: true, error: null });
    try {
      await payPendingDebt(payload);
      set({ isPaying: false });
    } catch (error: unknown) {
      set({ error: 'Failed to process debt payment.', isPaying: false });
      throw error;
    }
  }
}));
