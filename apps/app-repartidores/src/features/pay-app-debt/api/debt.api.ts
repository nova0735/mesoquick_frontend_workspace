import { apiClient } from '@mesoquick/core-network';
import { GenericApiResponse } from '../../../entities/wallet/model/types';

export interface PayPendingRequest {
  transactionId: string;
}

export const payPendingDebt = async (payload: PayPendingRequest): Promise<GenericApiResponse> => {
  const { data } = await apiClient.post<GenericApiResponse>('/api/wallet/pay-pending', payload);
  return data;
};
