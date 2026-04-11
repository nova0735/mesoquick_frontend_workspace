import { create } from 'zustand';
import { loginRequest } from '../../../features/authenticate-user/api/auth.api';
import { apiClient } from '@mesoquick/core-network'; // Importamos el cliente para la validación silenciosa

// ==========================================
// MODEL LAYER: Estado y Lógica de Negocio
// ==========================================
// 🧩 FSD: Centraliza el estado de la feature. Orquesta las llamadas a la API
// y expone el estado para que la UI (LoginForm) lo consuma pasivamente.

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrating: boolean;
  error: string | null;
  token: string | null;
  // Promesa de hidratación definida
  hydrate: () => Promise<void>;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrating: true, // Empieza en true para que SessionProvider muestre carga
  error: null,
  token: localStorage.getItem('access_token'),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Llamamos a la capa API aislada
      const { tokens, user } = await loginRequest(email, password);
      
      localStorage.setItem('access_token', tokens.accessToken);
      if (tokens.refreshToken) localStorage.setItem('refresh_token', tokens.refreshToken);

      set({ user, token: tokens.accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response && (err.response.status === 401 || err.response.status === 400)
        ? 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.'
        : 'Ocurrió un error de red. Inténtalo de nuevo más tarde.';
        
      set({ error: errorMessage, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  // 👇 AQUÍ ESTÁ LA FUNCIÓN FALTANTE 👇
  hydrate: async () => {
    const currentToken = localStorage.getItem('access_token');
    
    // Si no hay token, apagamos la hidratación y lo dejamos como no autenticado
    if (!currentToken) {
      set({ isHydrating: false, isAuthenticated: false });
      return;
    }

    try {
      // Si hay token, verificamos silenciosamente con el backend si sigue siendo válido
      // Nota: Asegúrate de que el endpoint '/auth/me' exista en tu backend, 
      // o ajusta la ruta si se llama diferente.
      const response = await apiClient.get('/auth/me');
      
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        isHydrating: false 
      });
    } catch (error) {
      // Si el servidor rechaza el token (ej. expiró y el refresh falló), limpiamos todo
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isHydrating: false 
      });
    }
  }
}));