import { apiClient } from '@mesoquick/core-network';

export interface CourierRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  vehicleType: 'MOTORCYCLE' | 'BICYCLE' | 'CAR';
  licensePlate: string;
  // Añadir otros campos según el Wizard si es necesario
}

/**
 * Envía el registro del nuevo repartidor al Broker de autenticación.
 * Asegura que el rol siempre sea 3 (Repartidor).
 */
export const submitCourierRegistration = async (data: CourierRegistrationData) => {
  const finalPayload = {
    ...data,
    rol: 3 // ID estricto para el rol de Repartidor en el sistema
  };
  
  const response = await apiClient.post('/api/auth/register', finalPayload);
  return response.data;
};