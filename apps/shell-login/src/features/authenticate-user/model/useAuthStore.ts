import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@mesoquick/core-network';

interface AuthState {
  token: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userPayload: any | null;
  login: (token: string) => void;
  logout: () => void;
}

/**
 * STORE DE AUTENTICACIÓN GLOBAL (Zustand v5)
 * 
 * Utiliza `persist` para guardar el estado en `localStorage` ('mesoquick-auth').
 * 
 * 🔀 NOTA DE ORQUESTACIÓN CENTRAL (Orchestration Switch):
 * Aquí se guarda el `token` y el `userPayload` decodificado. 
 * En la capa UI (LoginForm), después de llamar a `login(token)`, se evaluará 
 * el campo `role` del payload para redirigir al usuario a su aplicación 
 * correspondiente (ej. Repartidores en http://localhost:5173).
 * Esta es la pieza clave para la arquitectura de Micro-Frontends.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userPayload: null,
      login: (token: string) => {
        const decoded = jwtDecode(token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, userPayload: decoded });
      },
      logout: () => {
        delete apiClient.defaults.headers.common['Authorization'];
        set({ token: null, userPayload: null });
        window.location.href = '/login';
      },
    }),
    {
      name: 'mesoquick-auth',
    }
  )
);