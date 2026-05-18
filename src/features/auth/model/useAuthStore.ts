import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { registerUser } from '../api/auth.api';
import type { AuthStore, RegisterFormData } from './auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await registerUser(data);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Error al registrarse';
          set({ error: message, isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mesoquick-auth', // clave en localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);