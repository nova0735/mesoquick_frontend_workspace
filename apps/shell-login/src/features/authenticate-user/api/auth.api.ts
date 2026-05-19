import { apiClient } from '@mesoquick/core-network';

// ==========================================
// API LAYER: Peticiones al backend
// ==========================================
// 🧩 FSD: Solo esta capa se comunica directamente con axios/apiClient.

export const loginRequest = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};