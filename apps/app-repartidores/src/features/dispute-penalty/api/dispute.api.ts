import { apiClient } from '@mesoquick/core-network';
import { CreateDisputeRequest, CreateDisputeResponse } from '../../../entities/support/model/types';

export const submitDisputeTicket = async (payload: CreateDisputeRequest, file?: File): Promise<CreateDisputeResponse> => {
  const formData = new FormData();
  formData.append('ticketTitle', payload.ticketTitle);
  formData.append('detail', payload.detail);
  
  if (file) {
    formData.append('file', file);
  }

  const { data } = await apiClient.post<CreateDisputeResponse>('/api/logistica/incidencias', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return data;
};
