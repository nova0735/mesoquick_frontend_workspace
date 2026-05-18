import { create } from 'zustand';
import { SupportDirectoryResponse } from '../../../entities/support/model/types';
import { fetchSupportDirectory } from '../api/directory.api';

interface DirectoryState {
  data: SupportDirectoryResponse | null;
  isLoading: boolean;
  error: string | null;
  loadDirectory: () => Promise<void>;
}

export const useDirectoryStore = create<DirectoryState>((set) => ({
  data: {
    phones: [
      {
        id: "p1",
        label: "Emergencias en ruta",
        value: "+502 1500-0000"
      }
    ],
    emails: [
      {
        id: "e1",
        label: "Soporte General",
        value: "ayuda@mesoquick.com"
      }
    ]
  },
  isLoading: false,
  error: null,
  loadDirectory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchSupportDirectory();
      set({ data, isLoading: false });
    } catch (error: unknown) {
      set({ error: 'Failed to load support directory.', isLoading: false });
    }
  }
}));
