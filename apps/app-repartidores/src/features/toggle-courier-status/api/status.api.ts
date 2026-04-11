import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición PATCH a '/courier/status'.
 * Actualiza la disponibilidad de trabajo del repartidor ante el gateway.
 * 
 * @param isOnline Estado booleano que indica si está activo para recibir pedidos.
 */
export const updateStatusRequest = async (isOnline: boolean) => {
  const response = await apiClient.patch('/courier/status', { isOnline });
  return response.data;
};