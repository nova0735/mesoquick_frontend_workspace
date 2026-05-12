import { create } from 'zustand';
import { FAQsResponse } from '../../../entities/support/model/types';
import { fetchFaqs } from '../api/faqs.api';

interface FaqState {
  data: FAQsResponse | null;
  isLoading: boolean;
  error: string | null;
  loadFaqs: () => Promise<void>;
}

export const useFaqStore = create<FaqState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  loadFaqs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchFaqs();
      set({ data, isLoading: false });
    } catch (error: unknown) {
      set({ error: 'Failed to load FAQs.', isLoading: false });
    }
  }
}));
