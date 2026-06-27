import type { SafetyLocation, SafetyCategoryValue } from '@/types/models';

import apiClient from './client';

type SafetyListParams = {
  category?: SafetyCategoryValue;
  search?:   string;
  page?:     number;
  per_page?: number;
};

type SafetyListResponse = {
  data: SafetyLocation[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

export async function listSafetyLocations(params: SafetyListParams = {}): Promise<SafetyListResponse> {
  const res = await apiClient.get<SafetyListResponse>('/api/v1/safety-locations', { params });
  return res.data;
}

export async function getSafetyLocation(id: number): Promise<SafetyLocation> {
  const res = await apiClient.get<{ data: SafetyLocation }>(`/api/v1/safety-locations/${id}`);
  return res.data.data;
}
