import { create } from 'zustand';
import { apiClient } from '@mesoquick/core-network';
import { WalletBalances, MorosityState, TransactionRecord, WalletSummaryResponse } from './types';

interface WalletState {
  balances: WalletBalances;
  morosityState: MorosityState;
  transactions: TransactionRecord[];
  isLoading: boolean;
  error: string | null;
  fetchWalletSummary: (startDate: string, endDate: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balances: { positiveBalance: 0, appDebt: 0, totalEarned: 0 },
  morosityState: 'NONE',
  transactions: [],
  isLoading: false,
  error: null,

  fetchWalletSummary: async (startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      // Petición a la API real del backend de logística
      const response = await apiClient.get('/api/logistica/repartidores/me/metricas', {
        params: { startDate, endDate }
      });

      const { total_entregas, total_cancelaciones, calificacion_promedio, tasa_exito } = response.data;
      
      // Mapeamos los datos reales a nuestro estado. 
      // Nota: balances.totalEarned se mantiene con el valor de tasa_exito o similar para UI.
      set({
        balances: {
          positiveBalance: calificacion_promedio, // Usamos calificación como métrica visual
          appDebt: total_cancelaciones,
          totalEarned: total_entregas
        },
        morosityState: tasa_exito > 0.8 ? 'NONE' : 'GRACE_PERIOD_WARNING',
        isLoading: false
      });
    } catch (error: unknown) {
      set({ 
        error: 'Error al obtener las métricas del repartidor.', 
        isLoading: false 
      });
    }
  }
}));