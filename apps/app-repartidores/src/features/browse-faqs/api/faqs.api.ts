import { apiClient } from '@mesoquick/core-network';
import { FAQsResponse } from '../../../entities/support/model/types';

export const fetchFaqs = async (): Promise<FAQsResponse> => {
  const { data } = await apiClient.get<FAQsResponse>('/api/support/faqs');
  return data;
};
