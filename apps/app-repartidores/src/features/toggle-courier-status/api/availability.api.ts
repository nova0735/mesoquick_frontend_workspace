import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición PATCH a '/api/couriers/me/availability'.
 * Este endpoint le indica al broker/backend si el repartidor está disponible
 * para recibir, aceptar y procesar nuevos pedidos en el sistema de colas.
 *
 * @param isAvailable Booleano que indica la intención del repartidor (true = conectarse, false = desconectarse).
 */
export const updateAvailability = async (isAvailable: boolean) => {
  const status = isAvailable ? 'AVAILABLE' : 'UNAVAILABLE';
  const response = await apiClient.patch('/api/couriers/me/availability', { status });
  return response.data;
};