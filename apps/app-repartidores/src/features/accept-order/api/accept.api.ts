import { apiClient } from '@mesoquick/core-network';

export const acceptOrder = async (orderId: string): Promise<any> => {
  const response = await apiClient.patch(`/api/orders/${orderId}/accept`);
  return response.data;
};