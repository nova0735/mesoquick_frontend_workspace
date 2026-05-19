import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición GET a '/api/auth/me'.
 * Este endpoint sirve para verificar si el token actual (inyectado automáticamente
 * por el interceptor de Axios en @mesoquick/core-network) sigue siendo válido en el servidor.
 */
export const verifySession = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};