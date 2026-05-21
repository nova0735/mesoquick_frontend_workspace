import { apiClient } from '@mesoquick/core-network';
import { CourierProfileResponse, UpdateProfileRequest } from '../../../entities/courier/model/types';

export interface ApiResponse {
  message: string;
}

export const fetchProfileDetails = async (): Promise<CourierProfileResponse> => {
  const { data } = await apiClient.get<CourierProfileResponse>('/api/couriers/me');
  return data;
};

export const updateProfileDetails = async (_payload: UpdateProfileRequest): Promise<ApiResponse> => {
  // Mock Híbrido de Emergencia: El backend aún no soporta la actualización de estos campos.
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: "Perfil actualizado exitosamente (Simulado)" };
};
