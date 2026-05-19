import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición GET a '/api/couriers/me/account-status'.
 * Este endpoint devuelve el estado de negocio actual del repartidor
 * (por ejemplo: 'ACTIVE', 'PENDING_DOCS', 'SUSPENDED').
 * Se asume que el token JWT ya es inyectado por el interceptor de Axios.
 */
export const fetchAccountStatus = async () => {
  const response = await apiClient.get('/api/couriers/me/account-status');
  return response.data;
};