import { apiClient } from '@mesoquick/core-network';

/**
 * @description Actualiza el estado operativo del repartidor en el backend de logística.
 * 
 * @param estado Estado deseado: 'disponible' para recibir pedidos o 'desconectado'.
 */
export const updateCourierStatus = async (estado: 'disponible' | 'desconectado') => {
  const response = await apiClient.patch('/api/logistica/repartidores/me/estado', { estado });
  return response.data;
};