import { create } from 'zustand';
import { updatePassword, UpdatePasswordRequest } from '../api/password.api';

interface PasswordState {
  isUpdating: boolean;
  error: string | null;
  changePassword: (payload: UpdatePasswordRequest) => Promise<void>;
}

export const usePasswordStore = create<PasswordState>((set) => ({
  isUpdating: false,
  error: null,

  changePassword: async (payload: UpdatePasswordRequest) => {
    set({ isUpdating: true, error: null });
    try {
      await updatePassword(payload);
      set({ isUpdating: false });
    } catch (error: unknown) {
      set({ error: 'Failed to update password. Please verify your current credentials.', isUpdating: false });
      throw error;
    }
  }
}));
