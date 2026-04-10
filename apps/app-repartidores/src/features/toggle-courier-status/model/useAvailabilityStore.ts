import { create } from 'zustand';
import { updateAvailability } from '../api/availability.api';

interface AvailabilityState {
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  toggleStatus: (currentStatus: boolean) => Promise<void>;
}

/**
 * STORE DE DISPONIBILIDAD (Zustand v5)
 * 
 * Administra el estado global de si el repartidor está aceptando viajes o no.
 */
export const useAvailabilityStore = create<AvailabilityState>((set) => ({
  isAvailable: false, // Inicia desconectado por defecto por seguridad
  isLoading: false,
  error: null,
  toggleStatus: async (currentStatus: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const newStatus = !currentStatus;
      await updateAvailability(newStatus);
      set({ isAvailable: newStatus, isLoading: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || error.message || 'Error al cambiar la disponibilidad.',
        isLoading: false,
      });
    }
  },
}));

/**
 * =========================================================================
 * 🚨 ATENCIÓN DEV 2 (INTEGRACIÓN CON GEOLOCATION MANAGER EN VANILLA JS) 🚨
 * =========================================================================
 * 
 * Como el `GeolocationManager` corre fuera del árbol de React, NO PUEDES USAR 
 * HOOKS de la forma tradicional (`useAvailabilityStore()`). Zustand nos expone 
 * el API nativa para leer y suscribirse al estado desde Vanilla JS:
 * 
 * 1. LECTURA SÍNCRONA (Obtener estado de inmediato):
 *    const isOnline = useAvailabilityStore.getState().isAvailable;
 * 
 * 2. SUSCRIPCIÓN REACTIVA (Escuchar cambios en tiempo real):
 *    useAvailabilityStore.subscribe((state, prevState) => {
 *      if (state.isAvailable !== prevState.isAvailable) {
 *        if (state.isAvailable) {
 *           // El repartidor encendió el switch. Inicia el tracking GPS.
 *           startGPS();
 *        } else {
 *           // El repartidor apagó el switch. Detén el tracking GPS.
 *           stopGPS();
 *        }
 *      }
 *    });
 */