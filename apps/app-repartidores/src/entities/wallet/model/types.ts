export type PaymentMethod = 'CASH' | 'CARD';
export type MorosityState = 'NONE' | 'GRACE_PERIOD_WARNING' | 'BLOCKED_CRITICAL_DEBT';

export interface TransactionRecord {
  transactionId: string;
  orderId: string;
  date: string;
  totalOrderAmount: number;
  earnedFee: number;
  paymentMethod: PaymentMethod;
  resultingBalance: number;
  isDebtSettled: boolean;
}

export interface WalletBalances {
  positiveBalance: number;
  appDebt: number;
  totalEarned: number;
}

export interface WalletSummaryResponse {
  balances: WalletBalances;
  morosityState: MorosityState;
  transactions: TransactionRecord[];
}

export interface GenericApiResponse {
  message: string;
}
