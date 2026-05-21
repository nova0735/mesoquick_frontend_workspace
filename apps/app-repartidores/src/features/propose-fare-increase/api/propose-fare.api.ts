import { apiClient } from '@mesoquick/core-network';
import { ProposeTariffRequest, GenericSupportResponse } from '../../../entities/support/model/types';

export const proposeFareIncrease = async (payload: ProposeTariffRequest): Promise<GenericSupportResponse> => {
  const { orderId, ...body } = payload;
  const { data } = await apiClient.post<GenericSupportResponse>(`/api/logistica/entregas/${orderId}/tarifa`, body);
  return data;
};
