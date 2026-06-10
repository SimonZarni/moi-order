import apiClient from '@/shared/api/client';
import { ApiResponse, KycApplication } from '@/types/models';

export async function fetchMerchantApplication(): Promise<KycApplication | null> {
  const response = await apiClient.get<ApiResponse<KycApplication | null>>('/api/v1/merchant/apply');
  return response.data.data;
}

export async function applyForMerchant(): Promise<KycApplication> {
  const response = await apiClient.post<ApiResponse<KycApplication>>('/api/v1/merchant/apply');
  return response.data.data;
}

export async function cancelMerchantApplication(): Promise<void> {
  await apiClient.delete('/api/v1/merchant/apply');
}
