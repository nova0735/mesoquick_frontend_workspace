import { create } from 'zustand';
import { updateCourierStatus } from '../api/status.api';

interface StatusState {
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}

interface StatusActions {
  toggleStatus: () => Promise<void>;
}

export const useStatusStore = create<StatusState & StatusActions>((set, get) => ({
  isOnline: false,
  isLoading: false,
  error: null,

  toggleStatus: async () => {
    const currentStatus = get().isOnline;
    const nextStatus = !currentStatus;
    const statusString = nextStatus ? 'disponible' : 'desconectado';
    
    set({ isLoading: true, error: null });
    
    try {
      await updateCourierStatus(statusString);
      set({ isOnline: nextStatus, isLoading: false });
    } catch (error: unknown) {
      set({ 
        isLoading: false, 
        error: 'Error al actualizar el estado en el servidor. Intente nuevamente.' 
      });
      // Importante: No cambiamos isOnline, el switch vuelve/se queda en su estado actual
      throw error;
    }
  }
}));