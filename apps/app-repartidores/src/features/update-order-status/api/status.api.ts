import { apiClient } from '@mesoquick/core-network';

export const updateStatus = async (orderId: string, status: string): Promise<any> => {
  const response = await apiClient.patch(`/api/orders/${orderId}/status`, { status });
  return response.data;
};