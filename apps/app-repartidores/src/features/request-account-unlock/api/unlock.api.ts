import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición POST a '/api/couriers/me/unlock-request'.
 * Este endpoint envía la apelación o justificación del repartidor al back-office
 * de administración para solicitar el desbloqueo o activación de su cuenta suspendida.
 * 
 * @param reason El motivo o justificación proporcionado por el repartidor.
 */
export const submitUnlockRequest = async (reason: string) => {
  const response = await apiClient.post('/api/couriers/me/unlock-request', { reason });
  return response.data;
};