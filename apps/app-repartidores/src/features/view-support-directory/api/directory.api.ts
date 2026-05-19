import { apiClient } from '@mesoquick/core-network';
import { SupportDirectoryResponse } from '../../../entities/support/model/types';

export const fetchSupportDirectory = async (): Promise<SupportDirectoryResponse> => {
  const { data } = await apiClient.get<SupportDirectoryResponse>('/api/support/directory');
  return data;
};
