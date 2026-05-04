import { apiClient } from '@mesoquick/core-network';
import { CancelOrderRequest, GenericSupportResponse } from '../../../entities/support/model/types';

export const requestOrderCancellation = async (payload: CancelOrderRequest): Promise<GenericSupportResponse> => {
  const { data } = await apiClient.post<GenericSupportResponse>('/api/support/orders/cancel-request', payload);
  return data;
};
