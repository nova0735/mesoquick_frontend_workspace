import { apiClient } from '@mesoquick/core-network';
import { CreateDisputeRequest, CreateDisputeResponse, UploadEvidenceResponse } from '../../../entities/support/model/types';

export const uploadEvidenceFile = async (file: File): Promise<UploadEvidenceResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await apiClient.post<UploadEvidenceResponse>('/api/support/upload-evidence', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const createDisputeTicket = async (payload: CreateDisputeRequest): Promise<CreateDisputeResponse> => {
  const { data } = await apiClient.post<CreateDisputeResponse>('/api/support/disputes', payload);
  return data;
};
