import { apiClient } from '@mesoquick/core-network';

export interface TransferResponse {
  message: string;
  amountTransferred: number;
  currency: string;
}

export const executeWithdrawal = async (): Promise<TransferResponse> => {
  const { data } = await apiClient.post<TransferResponse>('/api/banking/transfer');
  return data;
};
