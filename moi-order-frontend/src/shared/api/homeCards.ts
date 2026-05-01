import { HomeCard } from '@/types/models';

import { apiClient } from './client';

export async function fetchHomeCards(): Promise<HomeCard[]> {
  const response = await apiClient.get<{ data: HomeCard[] }>('/home-cards');
  return response.data.data;
}
