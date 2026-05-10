import { apiClient } from '@mesoquick/core-network';

export interface ChatbotMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  action?: {
    type: string;
    data?: any;
  };
}

export const sendMessage = async (message: string): Promise<ChatbotMessage> => {
  const { data } = await apiClient.post<ChatbotMessage>('/api/support/chatbot/message', { message });
  return data;
};