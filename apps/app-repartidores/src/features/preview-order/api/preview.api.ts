import { apiClient } from '@mesoquick/core-network';

export const getOrderPreview = async (orderId: string): Promise<any> => {
  const response = await apiClient.get(`/api/orders/${orderId}/preview`);
  return response.data;
};