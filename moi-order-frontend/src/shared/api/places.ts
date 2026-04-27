import apiClient from '@/shared/api/client';
import { PaginatedResponse, ApiResponse, Place } from '@/types/models';

export async function fetchPlaces(page: number, search?: string): Promise<PaginatedResponse<Place>> {
  const response = await apiClient.get<PaginatedResponse<Place>>('/api/v1/places', {
    params: { page, ...(search ? { search } : {}) },
  });
  return response.data;
}

export async function fetchAllPlaces(): Promise<Place[]> {
  const all: Place[] = [];
  const seen = new Set<number>();
  let page = 1;
  while (true) {
    const response = await apiClient.get<PaginatedResponse<Place>>('/api/v1/places', {
      params: { page, per_page: 100 },
    });
    const { data, meta } = response.data;
    for (const place of data) {
      if (!seen.has(place.id)) {
        seen.add(place.id);
        all.push(place);
      }
    }
    if (meta.current_page >= meta.last_page) break;
    page++;
  }
  return all;
}

export async function fetchPlaceDetail(id: number): Promise<Place> {
  const response = await apiClient.get<ApiResponse<Place>>(`/api/v1/places/${id}`);
  return response.data.data;
}
