import { create } from 'zustand';
// 1. Importamos AuthAPI y apiClient desde tu paquete core-network
import { AuthAPI, apiClient } from '@mesoquick/core-network'; 

// ==========================================
// MODEL LAYER: Estado y Lógica de Negocio
// ==========================================

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
  isHydrating: true, 
  error: null,
  token: localStorage.getItem('access_token'),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // 2. Usamos el endpoint real del Broker
      const data = await AuthAPI.login({
        email: email,
        passwordRaw: password
      });
      
      // 3. Guardamos el JWT devuelto por el broker
      localStorage.setItem('access_token', data.token);
      // Ojo: El broker actual en su documentación no menciona refresh_token, así que lo omitimos por ahora.

      // 4. Mapeamos los datos del backend a tu interfaz local
      const userFromBroker: User = {
        id: String(data.usuario.id), 
        email: data.usuario.email,
        role: data.usuario.rol || data.usuario.role 
      };

      set({ 
        user: userFromBroker, 
        token: data.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: any) {
      // Manejo de errores
      set({ 
        error: 'Credenciales inválidas o error de conexión. Verifica tu correo y contraseña.', 
        isLoading: false 
      });
      throw err; // Lanzamos el error para que la UI no haga la redirección
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  hydrate: async () => {
    const currentToken = localStorage.getItem('access_token');
    
    if (!currentToken) {
      set({ isHydrating: false, isAuthenticated: false });
      return;
    }

    try {
      // Nota: Si el broker no tiene /auth/me, esto fallará. 
      // Si falla, asegúrate de pedirle al backend el endpoint de validación correcto.
      const response = await apiClient.get('/auth/me');
      
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        isHydrating: false 
      });
    } catch (error) {
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