import { apiClient } from '@mesoquick/core-network';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  attachment?: string;
}

export const getChatHistory = async (): Promise<ChatMessage[]> => {
  const { data } = await apiClient.get<ChatMessage[]>('/api/support/chat/history');
  return data;
};

export const uploadEvidence = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<{ url: string }>('/api/support/upload-evidence', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};