import { apiClient } from '@mesoquick/core-network';

export const submitCourierRegistration = async (formData: FormData) => { 
  return await apiClient.post('/courier/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};