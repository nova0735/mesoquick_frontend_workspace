import { create } from 'zustand';
// 1. Importamos apiClient y jwt-decode
import { apiClient } from '@mesoquick/core-network'; 
import { jwtDecode } from 'jwt-decode';

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
      // 2. Usamos el endpoint real del Broker vía apiClient para heredar interceptores
      const { data } = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      // 3. Guardamos el JWT devuelto por el broker (data.data.token)
      const token = data.data.token;
      localStorage.setItem('access_token', token);

      // 4. Mapeamos los datos del backend a tu interfaz local mediante el token
      const decoded: any = jwtDecode(token);
      const userFromBroker: User = {
        id: String(decoded.id || decoded.sub), 
        email: decoded.email,
        role: decoded.rol || decoded.role 
      };

      set({ 
        user: userFromBroker, 
        token: token, 
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
      // 🧩 FSD: Hidratación puramente en el cliente mediante decodificación de JWT.
      // Eliminamos la dependencia de /auth/me para mejorar la velocidad de carga inicial.
      const decoded: any = jwtDecode(currentToken);
      
      const userFromToken: User = {
        id: String(decoded.id || decoded.sub),
        email: decoded.email,
        role: decoded.rol || decoded.role
      };

      set({ 
        user: userFromToken, 
        isAuthenticated: true, 
        isHydrating: false 
      });
    } catch (error) {
      console.error("Error al hidratar sesión (JWT inválido):", error);
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