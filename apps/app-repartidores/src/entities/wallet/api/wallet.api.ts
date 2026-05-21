import { apiClient } from '@mesoquick/core-network';
import { TransactionRecord, MorosityState } from '../model/types';

export interface WalletBackendDTO {
  total_earned: number;
  total_cash_debt: number;
  morosity_state: MorosityState;
  transactions: TransactionRecord[];
}

export interface WalletApiResponse {
  result: WalletBackendDTO;
}

export const fetchWalletSummary = async (
  courierId: string,
  startDate?: string,
  endDate?: string
): Promise<WalletBackendDTO> => {
  const { data } = await apiClient.get<WalletApiResponse>('/api/cobros/wallet/summary', {
    params: { courierId, startDate, endDate }
  });
  return data.result;
};

export const payPendingDebt = async (
  courierId: string,
  transactionId: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>('/api/cobros/wallet/pay-pending', {
    courierId,
    transactionId
  });
  return data;
};
