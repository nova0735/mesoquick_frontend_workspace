import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición POST a '/api/auth/logout'.
 * Este endpoint le indica al broker/backend que debe invalidar o 
 * colocar en lista negra (blacklist) el token actual en el lado del servidor.
 */
export const logoutRequest = async () => {
  const response = await apiClient.post('/api/auth/logout');
  return response.data;
};