import { apiClient } from '@mesoquick/core-network';
import { ProposeTariffRequest, GenericSupportResponse } from '../../../entities/support/model/types';

export const proposeFareIncrease = async (payload: ProposeTariffRequest): Promise<GenericSupportResponse> => {
  const { data } = await apiClient.post<GenericSupportResponse>('/api/support/tariffs/propose', payload);
  return data;
};
