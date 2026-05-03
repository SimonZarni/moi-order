import apiClient from '@/shared/api/client';
import { ApiResponse, VerificationStatus } from '@/types/models';

export async function fetchVerificationStatus(): Promise<VerificationStatus> {
  const response = await apiClient.get<ApiResponse<VerificationStatus>>('/api/v1/verification/status');
  return response.data.data;
}
