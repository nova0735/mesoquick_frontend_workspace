export * from './axios.interceptor';
export { apiClient } from './axios.interceptor';

export interface CourierStatusResponse {
  status: 'IDLE' | 'BUSY' | 'OFFLINE';
  currentOrderId?: string;
}