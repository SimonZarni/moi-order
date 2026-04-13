import apiClient from '@/shared/api/client';
import { ApiResponse, Payment } from '@/types/models';

export async function createPayment(submissionId: number): Promise<Payment> {
  const response = await apiClient.post<ApiResponse<Payment>>(
    `/api/v1/submissions/${submissionId}/payment`,
  );
  return response.data.data;
}

export async function fetchPayment(submissionId: number): Promise<Payment> {
  const response = await apiClient.get<ApiResponse<Payment>>(
    `/api/v1/submissions/${submissionId}/payment`,
  );
  return response.data.data;
}
