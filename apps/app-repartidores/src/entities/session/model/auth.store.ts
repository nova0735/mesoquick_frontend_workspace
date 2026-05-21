import { create } from 'zustand';
// Importamos el cliente de red centralizado y jwt-decode
import { apiClient } from '@mesoquick/core-network';
import { jwtDecode } from 'jwt-decode';

// ==========================================
// MODEL: Global Authentication Store (Zustand)
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Este es el 'model' a nivel de aplicación. Centraliza todo el estado y la lógica
// de negocio relacionados con la sesión del usuario. Las 'features' (como LoginForm)
// y los 'providers' (como SessionProvider) consumirán este store, pero no se
// comunicarán entre sí directamente.

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
}

interface AuthActions {
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isHydrating: true,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  /**
   * Acción para iniciar sesión. Extrae datos del JWT y actualiza el estado.
   */
  login: (tokens) => {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    
    try {
      const payload: any = jwtDecode(tokens.accessToken);
      const userData: User = {
        id: String(payload.id || payload.sub || ''),
        email: payload.email || '',
        role: payload.rol || payload.role || 'COURIER',
        firstName: payload.firstName || payload.first_name,
        lastName: payload.lastName || payload.last_name,
      };
      set({ user: userData, isAuthenticated: true });
    } catch (e) {
      console.error("Error decoding token in login:", e);
      set({ user: null, isAuthenticated: false });
    }
  },

  /**
   * Acción para cerrar sesión.
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set(initialState);
    const loginUrl = import.meta.env?.VITE_SHELL_LOGIN_URL || 'http://localhost:5173/login';
    window.location.href = loginUrl;
  },

  /**
   * Acción para hidratar la sesión extrayendo datos del token existente.
   */
  hydrate: async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('access_token', tokenFromUrl);
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }

    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        const payload: any = jwtDecode(token);
        const userData: User = {
          id: String(payload.id || payload.sub || ''),
          email: payload.email || '',
          role: payload.rol || payload.role || 'COURIER',
          firstName: payload.firstName || payload.first_name,
          lastName: payload.lastName || payload.last_name,
        };
        set({ user: userData, isAuthenticated: true, isHydrating: false });
        return;
      } catch (e) {
        console.error("Error decoding token in hydrate:", e);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }

    set({ isHydrating: false, isAuthenticated: false, user: null });
  },
}));