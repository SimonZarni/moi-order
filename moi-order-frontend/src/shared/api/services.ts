import apiClient from '@/shared/api/client';
import { ApiResponse, Service } from '@/types/models';

export async function fetchServices(): Promise<Service[]> {
  const response = await apiClient.get<{ data: Service[] }>('/api/v1/services');
  return response.data.data;
}
