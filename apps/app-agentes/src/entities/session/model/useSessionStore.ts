import { create } from 'zustand';
import type { AuthResponse, SessionState } from './types';
import {
  clearSession as clearPersistedSession,
  readSession,
  writeSession,
} from '../lib/sessionStorage';

/**
 * Store global de sesión. Vive en la capa entities/ porque múltiples features
 * (MainLayout para mostrar el nombre del agente, ProtectedRoute para validar el
 * rol, el logout button, etc.) necesitan leerlo y mutarlo.
 *
 * REGLA: consumir siempre con selectores atómicos desde los componentes:
 *   const user = useSessionStore((state) => state.user);
 */
interface SessionStoreActions {
  hydrateFromStorage: () => void;
  setSession: (payload: AuthResponse) => void;
  clear: () => void;
}

export type SessionStore = SessionState & SessionStoreActions;

export const useSessionStore = create<SessionStore>((set) => ({
  token: null,
  user: null,
  isHydrated: false,

  hydrateFromStorage: () => {
    const persisted = readSession();
    if (persisted) {
      set({
        token: persisted.token,
        user: persisted.user,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },

  setSession: (payload) => {
    writeSession(payload);
    set({
      token: payload.token,
      user: payload.user,
      isHydrated: true,
    });
  },

  clear: () => {
    clearPersistedSession();
    set({ token: null, user: null, isHydrated: true });
  },
}));
