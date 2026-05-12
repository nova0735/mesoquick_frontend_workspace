import { create } from 'zustand';
import { uploadEvidenceFile, createDisputeTicket } from '../api/dispute.api';
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
      let evidenceUrl = undefined;
      
      if (file) {
        const uploadRes = await uploadEvidenceFile(file);
        evidenceUrl = uploadRes.url;
      }
      
      const ticketRes = await createDisputeTicket({ ...payload, evidenceUrl });
      set({ isSubmitting: false, ticketId: ticketRes.ticketId });
    } catch (error: unknown) {
      set({ isSubmitting: false, error: 'Failed to create dispute ticket.' });
      throw error;
    }
  },
  resetState: () => set({ isSubmitting: false, ticketId: null, error: null })
}));
