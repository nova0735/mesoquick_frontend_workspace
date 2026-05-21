import { apiClient } from '@mesoquick/core-network';
import { CancelOrderRequest, GenericSupportResponse } from '../../../entities/support/model/types';

export const requestOrderCancellation = async (payload: CancelOrderRequest): Promise<GenericSupportResponse> => {
  const { orderId, ...body } = payload;
  const { data } = await apiClient.post<GenericSupportResponse>(`/api/logistica/entregas/${orderId}/cancel`, body);
  return data;
};
