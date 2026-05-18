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
  balances: { positiveBalance: 350.50, appDebt: 0, totalEarned: 1250.75 },
  morosityState: 'NONE',
  transactions: [
    {
      transactionId: 'TX-1001',
      date: new Date().toISOString(),
      orderId: 'ORD-5521',
      totalOrderAmount: 125.00,
      paymentMethod: 'CARD',
      earnedFee: 25.00,
      resultingBalance: 350.50,
      isDebtSettled: true
    },
    {
      transactionId: 'TX-1002',
      date: new Date(Date.now() - 86400000).toISOString(),
      orderId: 'ORD-5520',
      totalOrderAmount: 85.50,
      paymentMethod: 'CASH',
      earnedFee: 15.00,
      resultingBalance: 325.50,
      isDebtSettled: true
    },
    {
      transactionId: 'TX-1003',
      date: new Date(Date.now() - 172800000).toISOString(),
      orderId: 'ORD-5519',
      totalOrderAmount: 210.00,
      paymentMethod: 'CARD',
      earnedFee: 30.00,
      resultingBalance: 310.50,
      isDebtSettled: true
    }
  ],
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
        error: 'Error al obtener el resumen de billetera. Por favor intenta de nuevo más tarde.', 
        isLoading: false 
      });
    }
  }
}));