import { create } from 'zustand';
import { submitDisputeTicket } from '../api/dispute.api';
import { CreateDisputeRequest } from '../../../entities/support/model/types';

interface DisputeState {
  isSubmitting: boolean;
  ticketId: string | null;
  error: string | null;
  submitDispute: (payload: CreateDisputeRequest, file?: File) => Promise<void>;
  resetState: () => void;
}

export const useDisputeStore = create<DisputeState>((set) => ({
  isSubmitting: false,
  ticketId: null,
  error: null,
  submitDispute: async (payload, file) => {
    set({ isSubmitting: true, error: null, ticketId: null });
    try {
      const ticketRes = await submitDisputeTicket(payload, file);
      set({ isSubmitting: false, ticketId: ticketRes.ticketId });
    } catch (error: unknown) {
      set({ isSubmitting: false, error: 'Error al crear el ticket de disputa.' });
      throw error;
    }
  },
  resetState: () => set({ isSubmitting: false, ticketId: null, error: null })
}));
