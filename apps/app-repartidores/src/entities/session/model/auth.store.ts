import { create } from 'zustand';
// Importamos el cliente de red centralizado que ya maneja interceptores
import { apiClient } from '@mesoquick/core-network';

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

/**
 * Utilidad segura para decodificar JWT en el cliente.
 */
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
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
    
    const payload = parseJwt(tokens.accessToken);
    if (payload) {
      const userData: User = {
        id: payload.sub || payload.id || '',
        email: payload.email || '',
        role: payload.role || 'COURIER',
        firstName: payload.firstName || payload.first_name,
        lastName: payload.lastName || payload.last_name,
      };
      set({ user: userData, isAuthenticated: true });
    } else {
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
    window.location.href = 'http://localhost:5173/login';
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
      const payload = parseJwt(token);
      if (payload) {
        const userData: User = {
          id: payload.sub || payload.id || '',
          email: payload.email || '',
          role: payload.role || 'COURIER',
          firstName: payload.firstName || payload.first_name,
          lastName: payload.lastName || payload.last_name,
        };
        set({ user: userData, isAuthenticated: true, isHydrating: false });
        return;
      }
    }

    set({ isHydrating: false, isAuthenticated: false, user: null });
  },
}));