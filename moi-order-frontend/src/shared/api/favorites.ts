import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/types/models';

export interface FavoriteStatus {
  is_favorited: boolean;
}

export async function fetchFavoriteStatus(placeId: number): Promise<FavoriteStatus> {
  const response = await apiClient.get<ApiResponse<FavoriteStatus>>(
    `/api/v1/places/${placeId}/favorite`,
  );
  return response.data.data;
}

export async function toggleFavorite(placeId: number): Promise<FavoriteStatus> {
  const response = await apiClient.post<ApiResponse<FavoriteStatus>>(
    `/api/v1/places/${placeId}/favorite`,
  );
  return response.data.data;
}
