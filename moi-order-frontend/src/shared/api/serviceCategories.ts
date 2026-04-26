import apiClient from '@/shared/api/client';
import { ServiceCategory } from '@/types/models';

export async function fetchServiceCategory(slug: string): Promise<ServiceCategory> {
  const response = await apiClient.get<{ data: ServiceCategory }>(`/api/v1/service-categories/${slug}`);
  return response.data.data;
}
