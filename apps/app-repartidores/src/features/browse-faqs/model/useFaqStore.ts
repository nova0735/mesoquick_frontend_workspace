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
  data: {
    categories: [
      {
        categoryName: "Billetera y Pagos",
        items: [
          {
            id: "1",
            question: "¿Cuándo recibo mis transferencias?",
            answer: "Las transferencias a cuentas asociadas son procesadas de manera inmediata."
          }
        ]
      },
      {
        categoryName: "Rutas",
        items: [
          {
            id: "2",
            question: "¿Qué hago si el cliente no responde?",
            answer: "Espera 5 minutos y utiliza el menú de 'Reportar un problema' para solicitar una cancelación sin multa."
          }
        ]
      }
    ]
  },
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
