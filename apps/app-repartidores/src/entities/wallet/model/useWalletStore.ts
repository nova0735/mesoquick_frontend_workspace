import { create } from 'zustand';

interface WalletState {
  transactions: any[];
  addTransaction: (transaction: any) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  transactions: [],
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, transaction]
  })),
}));