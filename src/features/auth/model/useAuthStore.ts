import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { registerUser, loginUser } from '../api/auth.api';
import { updateUser } from '../api/users.db';
import type {
  AuthStore,
  RegisterFormData,
  LoginFormData,
  AuthUser,
} from './auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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

      login: async (data: LoginFormData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await loginUser(data);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Error al iniciar sesión';
          set({ error: message, isLoading: false });
        }
      },

      /**
       * Actualiza campos editables del perfil del usuario actual.
       * Refleja el cambio también en la "BD" mock para que persista
       * entre sesiones (si el usuario cierra y vuelve a entrar, ve sus
       * datos actualizados).
       */
      updateProfile: (
        changes: Partial<Pick<AuthUser, 'phone' | 'defaultAddress'>>
      ) => {
        const current = get().user;
        if (!current) return;

        // Actualizar en la sesión activa
        set({ user: { ...current, ...changes } });

        // Persistir en la BD mock
        updateUser(current.id, changes);
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