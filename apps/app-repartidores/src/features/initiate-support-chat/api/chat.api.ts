import { apiClient } from '@mesoquick/core-network';
import { ChatHistoryResponse } from '../../../entities/support/model/types';

export const getChatHistory = async (): Promise<ChatHistoryResponse> => {
  const { data } = await apiClient.get<ChatHistoryResponse>('/api/chats/session/history');
  return data;
};
