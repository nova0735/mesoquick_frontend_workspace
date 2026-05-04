import { create } from 'zustand';
import { 
  BankingInstitutionsResponse, 
  LinkedBankAccount, 
  UpdateBankAccountRequest 
} from '../../../entities/banking/model/types';
import { fetchInstitutions, fetchMyAccounts, updateBankAccount } from '../api/bank.api';

interface BankState {
  institutions: BankingInstitutionsResponse | null;
  currentAccount: LinkedBankAccount | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  initializeData: () => Promise<void>;
  updateAccount: (payload: UpdateBankAccountRequest) => Promise<void>;
}

export const useBankStore = create<BankState>((set) => ({
  institutions: null,
  currentAccount: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  initializeData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [institutionsData, accountsData] = await Promise.all([
        fetchInstitutions(),
        fetchMyAccounts()
      ]);
      set({ 
        institutions: institutionsData, 
        currentAccount: accountsData.bankAccount, 
        isLoading: false 
      });
    } catch (error: unknown) {
      set({ error: 'Failed to load banking information.', isLoading: false });
    }
  },

  updateAccount: async (payload: UpdateBankAccountRequest) => {
    set({ isUpdating: true, error: null });
    try {
      await updateBankAccount(payload);
      // Optimistic update of the local state
      set((state) => ({
        currentAccount: state.currentAccount ? {
          ...state.currentAccount,
          bankId: payload.bankId,
          accountType: payload.accountType,
          accountNumber: payload.accountNumber,
        } : null,
        isUpdating: false
      }));
    } catch (error: unknown) {
      set({ error: 'Failed to update bank account.', isUpdating: false });
      throw error;
    }
  }
}));
