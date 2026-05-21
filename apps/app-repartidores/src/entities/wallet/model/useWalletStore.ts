import { create } from 'zustand';
import { WalletBalances, MorosityState, TransactionRecord } from './types';
import { fetchWalletSummary, payPendingDebt } from '../api/wallet.api';

interface WalletState {
  balances: WalletBalances;
  morosityState: MorosityState;
  transactions: TransactionRecord[];
  isLoading: boolean;
  error: string | null;
  fetchWalletSummary: (courierId: string, startDate?: string, endDate?: string) => Promise<void>;
  payDebt: (courierId: string, transactionId: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balances: { positiveBalance: 0, appDebt: 0, totalEarned: 0 },
  morosityState: 'NONE',
  transactions: [],
  isLoading: false,
  error: null,

  fetchWalletSummary: async (courierId: string, startDate?: string, endDate?: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await fetchWalletSummary(courierId, startDate, endDate);
      
      // Mapeo solicitado para el MVP:
      // totalEarned = result.total_earned
      // appDebt = result.total_cash_debt
      // positiveBalance = total_earned - total_cash_debt
      set({
        balances: {
          totalEarned: result.total_earned,
          appDebt: result.total_cash_debt,
          positiveBalance: result.total_earned - result.total_cash_debt
        },
        morosityState: result.morosity_state,
        transactions: result.transactions || [],
        isLoading: false
      });
    } catch (error: unknown) {
      set({ 
        error: 'Error al obtener el resumen de la billetera.', 
        isLoading: false 
      });
    }
  },

  payDebt: async (courierId: string, transactionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await payPendingDebt(courierId, transactionId);
      
      // Actualización local de transacciones
      set((state) => ({
        transactions: state.transactions.map((t) => 
          t.transactionId === transactionId ? { ...t, isDebtSettled: true } : t
        ),
        isLoading: false
      }));
    } catch (error: unknown) {
      set({ 
        error: 'Error al procesar el pago de la deuda.', 
        isLoading: false 
      });
      throw error;
    }
  }
}));