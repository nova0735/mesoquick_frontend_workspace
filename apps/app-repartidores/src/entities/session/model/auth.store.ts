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
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean; // Estado para saber si estamos verificando la sesión al cargar la app
}

interface AuthActions {
  login: (tokens: { accessToken: string; refreshToken: string }, userData: User) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isHydrating: true, // Inicia en true para que el SessionProvider muestre un loader
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  /**
   * Acción para iniciar sesión. Guarda tokens y actualiza el estado.
   */
  login: (tokens, userData) => {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    set({ user: userData, isAuthenticated: true });
    // NOTA: La redirección post-login se maneja en la UI,
    // que reacciona a `isAuthenticated: true`.
  },

  /**
   * Acción para cerrar sesión. Limpia todo y redirige.
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set(initialState);
    window.location.href = '/'; // Redirección forzada a la página de login
  },

  /**
   * Acción para "hidratar" la sesión. Se ejecuta al inicio de la app.
   * Verifica si hay un token válido y recupera los datos del usuario.
   */
  hydrate: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isHydrating: false });
      return;
    }

    try {
      // El apiClient ya tiene el interceptor que añade el token 'Bearer'
      const response = await apiClient.get<User>('/auth/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      // Si /me falla (ej. 401), el interceptor de apiClient intentará refrescar.
      // Si el refresco también falla, el interceptor limpiará el storage y redirigirá.
      // Si solo /me falla por otra razón, simplemente cerramos sesión aquí para estar seguros.
      console.error("Hydration failed, logging out.", error);
      useAuthStore.getState().logout();
    } finally {
      // Pase lo que pase, dejamos de "hidratar" para que la UI pueda renderizarse.
      set({ isHydrating: false });
    }
  },
}));