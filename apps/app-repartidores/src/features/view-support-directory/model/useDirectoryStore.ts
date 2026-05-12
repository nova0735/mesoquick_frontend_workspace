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
  data: null,
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
