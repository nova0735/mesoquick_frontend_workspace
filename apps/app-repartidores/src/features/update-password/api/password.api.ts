import { apiClient } from '@mesoquick/core-network';

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface GenericApiResponse {
  message: string;
}

export const updatePassword = async (payload: UpdatePasswordRequest): Promise<GenericApiResponse> => {
  const { data } = await apiClient.patch<GenericApiResponse>('/api/auth/password', payload);
  return data;
};
