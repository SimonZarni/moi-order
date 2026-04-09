import apiClient from '@/shared/api/client';
import { PaginatedResponse, ApiResponse, Place } from '@/types/models';

export async function fetchPlaces(page: number): Promise<PaginatedResponse<Place>> {
  const response = await apiClient.get<PaginatedResponse<Place>>('/api/v1/places', {
    params: { page },
  });
  return response.data;
}

export async function fetchPlaceDetail(id: number): Promise<Place> {
  const response = await apiClient.get<ApiResponse<Place>>(`/api/v1/places/${id}`);
  return response.data.data;
}
