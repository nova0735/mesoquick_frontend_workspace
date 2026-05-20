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
    window.location.href = 'http://localhost:5173/login'; // Redirección explícita al Shell Login
  },

  /**
   * Acción para "hidratar" la sesión. Se ejecuta al inicio de la app.
   * Verifica si hay un token válido y recupera los datos del usuario.
   */
  hydrate: async () => {
  // 1. EXTRA: Detectar si el token viene en la URL desde el Shell-Login
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    // Si viene en la URL, lo guardamos en el LocalStorage de ESTE puerto (5174)
    localStorage.setItem('access_token', tokenFromUrl);
    
    // Limpiamos la URL para que el token no se quede visible en la barra de direcciones
    const newUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }

  // 2. Lógica original: Intentar obtener el token (ya sea el viejo o el nuevo que acabamos de guardar)
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
    console.error("Hydration failed, logging out.", error);
    // Usamos el método interno para limpiar todo si el token no es válido
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('access_token');
  } finally {
    set({ isHydrating: false });
  }
},
}));