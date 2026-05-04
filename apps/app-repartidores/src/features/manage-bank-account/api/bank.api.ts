import { apiClient } from '@mesoquick/core-network';
import { 
  BankingInstitutionsResponse, 
  MyAccountsResponse, 
  UpdateBankAccountRequest, 
  GenericApiResponse 
} from '../../../entities/banking/model/types';

export const fetchInstitutions = async (): Promise<BankingInstitutionsResponse> => {
  const { data } = await apiClient.get<BankingInstitutionsResponse>('/api/banking/institutions');
  return data;
};

export const fetchMyAccounts = async (): Promise<MyAccountsResponse> => {
  const { data } = await apiClient.get<MyAccountsResponse>('/api/banking/me/accounts');
  return data;
};

export const updateBankAccount = async (payload: UpdateBankAccountRequest): Promise<GenericApiResponse> => {
  const { data } = await apiClient.put<GenericApiResponse>('/api/banking/me/accounts', payload);
  return data;
};
