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
      const response = await apiClient.get<WalletSummaryResponse>('/api/wallet/summary', {
        params: { startDate, endDate }
      });
      
      set({
        balances: response.data.balances,
        morosityState: response.data.morosityState,
        transactions: response.data.transactions,
        isLoading: false
      });
    } catch (error: unknown) {
      set({ 
        error: 'Failed to fetch wallet summary. Please try again later.', 
        isLoading: false 
      });
    }
  }
}));