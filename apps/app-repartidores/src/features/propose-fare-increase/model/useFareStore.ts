import { create } from 'zustand';
import { proposeFareIncrease } from '../api/fare.api';
import { ProposeTariffRequest } from '../../../entities/support/model/types';

interface FareState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submitProposal: (payload: ProposeTariffRequest) => Promise<void>;
  resetState: () => void;
}

export const useFareStore = create<FareState>((set) => ({
  isSubmitting: false,
  isSuccess: false,
  error: null,
  submitProposal: async (payload) => {
    set({ isSubmitting: true, error: null, isSuccess: false });
    try {
      await proposeFareIncrease(payload);
      set({ isSubmitting: false, isSuccess: true });
    } catch (error: unknown) {
      set({ isSubmitting: false, error: 'Failed to submit proposal.' });
      throw error;
    }
  },
  resetState: () => set({ isSubmitting: false, isSuccess: false, error: null })
}));
