export type TransactionType = 'CREDIT' | 'DEBT' | 'WITHDRAWAL' | 'PAYMENT';

export interface WalletTransaction {
  id: string;
  orderId?: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  resultingBalance: number;
}

export interface WalletSummary {
  favorableBalance: number;
  debtToApp: number;
  totalEarned: number;
  isGracePeriodActive: boolean;
  isCriticallySuspended: boolean;
}
