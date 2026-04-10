import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta la petición POST usando rutas relativas.
 * El proxy de Vite enviará la petición a 'http://broker-gateway:8000/api/auth/login'.
 * Devuelve el cuerpo de la respuesta que debe contener el JWT generado por el backend.
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};