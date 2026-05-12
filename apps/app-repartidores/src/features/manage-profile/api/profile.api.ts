import { apiClient } from '@mesoquick/core-network';
import { CourierProfileResponse, UpdateProfileRequest } from '../../../entities/courier/model/types';

export interface ApiResponse {
  message: string;
}

export const fetchProfileDetails = async (): Promise<CourierProfileResponse> => {
  const { data } = await apiClient.get<CourierProfileResponse>('/api/couriers/me');
  return data;
};

export const updateProfileDetails = async (payload: UpdateProfileRequest): Promise<ApiResponse> => {
  const { data } = await apiClient.put<ApiResponse>('/api/couriers/me', payload);
  return data;
};
