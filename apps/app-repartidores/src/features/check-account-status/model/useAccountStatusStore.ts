import { create } from 'zustand';
import { fetchAccountStatus } from '../api/status.api';

interface AccountStatusState {
  status: string | null;
  isLoading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
}

/**
 * STORE DE ESTADO DE CUENTA (Zustand v5)
 *
 * 📝 NOTA DE INTEGRACIÓN FSD:
 * Esta acción `checkStatus()` y el componente UI asociado deben ser montados 
 * en el `MainLayout` de la app de Repartidores. 
 * 
 * Su propósito es garantizar que el repartidor esté autorizado ('ACTIVE')
 * para trabajar y recibir pedidos antes de dejarlo navegar libremente. Si 
 * el estado no es ACTIVE, mostraremos una pantalla de bloqueo.
 */
export const useAccountStatusStore = create<AccountStatusState>((set) => ({
  status: null,
  // Inicializamos en true para prevenir "parpadeos" (flickering) del contenido
  // de la app antes de tener la respuesta real del backend.
  isLoading: true, 
  error: null,
  checkStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchAccountStatus();
      // El backend podría devolver { status: 'ACTIVE' } o directamente el string
      set({ status: data?.status || data, isLoading: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || error.message || 'Error al verificar el estado de la cuenta.', 
        isLoading: false 
      });
    }
  },
}));