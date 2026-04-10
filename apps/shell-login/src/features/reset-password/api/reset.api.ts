import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición POST a '/api/auth/password-reset'.
 * Este endpoint recibe el correo electrónico del usuario y le indica al backend
 * (broker-gateway/auth service) que debe generar un token seguro de recuperación
 * y enviar un correo electrónico con el enlace de restablecimiento.
 * 
 * @param email Correo electrónico del usuario que olvidó su contraseña.
 */
export const requestPasswordReset = async (email: string) => {
  const response = await apiClient.post('/api/auth/password-reset', { email });
  return response.data;
};