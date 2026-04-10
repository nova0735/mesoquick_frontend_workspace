import { apiClient } from '@mesoquick/core-network';

/**
 * @description Ejecuta una petición POST a '/api/couriers/register'.
 * Se envía un objeto nativo `FormData` en lugar de un JSON normal porque
 * necesitamos transmitir archivos binarios (fotos del DPI y del rostro)
 * junto con los datos de texto en una sola transacción multipart.
 * 
 * @param formData El objeto FormData nativo ensamblado por el Store.
 */
export const submitCourierRegistration = async (formData: FormData) => {
  const response = await apiClient.post('/api/couriers/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // CRÍTICO: Indica al backend que hay archivos adjuntos
    },
  });
  return response.data;
};