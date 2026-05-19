import { create } from 'zustand';
import { verifySession } from '../api/hydrate.api';
import { useAuthStore } from '../../authenticate-user';

interface HydrationState {
  isHydrating: boolean;
  hasHydrated: boolean;
  hydrate: () => Promise<void>;
}

/**
 * STORE DE HIDRATACIÓN DE SESIÓN (Zustand v5)
 *
 * 💧 NOTA DE ARQUITECTURA FSD:
 * Esta acción `hydrate()` debe ser llamada UNA SOLA VEZ en el nivel raíz de
 * la aplicación (por ejemplo, dentro de App.tsx, en el Router principal o un MainLayout).
 * Su objetivo es evitar "flickering" o renders no autorizados cuando el usuario
 * recarga la página. Valida silenciosamente si el JWT persistido sigue vivo.
 */
export const useHydrationStore = create<HydrationState>((set) => ({
  isHydrating: true, // Inicializado en true para poder mostrar un "Loading" global si se desea
  hasHydrated: false,
  hydrate: async () => {
    set({ isHydrating: true });

    const token = useAuthStore.getState().token;

    // 1. Si no hay token, marcamos como hidratado y salimos temprano (usuario no logueado)
    if (!token) {
      set({ isHydrating: false, hasHydrated: true });
      return;
    }

    // 2. Si hay token, intentamos verificar la sesión silenciosamente
    try {
      await verifySession();
      // ÉXITO: El token es válido
      set({ isHydrating: false, hasHydrated: true });
    } catch (error) {
      // ERROR: El token ha expirado o es inválido en el backend.
      // Llamamos al logout del AuthStore para purgar los datos sucios (localStorage)
      // y el logout mismo se encargará de redirigir a /login.
      useAuthStore.getState().logout();
      set({ isHydrating: false, hasHydrated: true });
    }
  },
}));