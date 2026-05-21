import { apiClient } from '@mesoquick/core-network';
import { ChatbotMessageRequest, ChatbotMessageResponse } from '../../../entities/support/model/types';

export const sendMessage = async (payload: ChatbotMessageRequest): Promise<ChatbotMessageResponse> => {
  const { data } = await apiClient.post<ChatbotMessageResponse>('/api/chats/session/message', payload);
  return data;
};