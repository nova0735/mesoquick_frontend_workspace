import { create } from 'zustand';
import { updateStatusRequest } from '../api/status.api';

interface StatusState {
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}

interface StatusActions {
  toggleStatus: () => Promise<void>;
}

/**
 * STORE DE ESTADO DEL REPARTIDOR (Zustand)
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Feature Model (`features/toggle-courier-status/model`). Encapsula de forma estricta
 * la lógica y el estado de la conexión (Online/Offline) del mensajero.
 */
export const useStatusStore = create<StatusState & StatusActions>((set, get) => ({
  isOnline: false, // Inicia desconectado por seguridad
  isLoading: false,
  error: null,

  toggleStatus: async () => {
    const currentStatus = get().isOnline;
    set({ isLoading: true, error: null });
    
    try {
      // Intentamos llamar a la API real
      await updateStatusRequest(!currentStatus);
      set({ isOnline: !currentStatus, isLoading: false });
    } catch (error: any) {
      // 🛠️ MOCK DE ARQUITECTURA: 
      // Como el backend no está listo/conectado, forzamos el cambio visual 
      // de todas formas para que el Dev 2 pueda probar la interfaz.
      console.warn("La API falló, pero cambiamos el estado visualmente para desarrollo.");
      set({ 
        isOnline: !currentStatus, 
        isLoading: false, 
        error: 'Backend no disponible, usando Mock local' 
      });
    }
  }
}));