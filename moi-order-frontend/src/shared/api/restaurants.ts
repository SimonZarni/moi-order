import apiClient from './client';
import { Restaurant } from '@/types/models';
import { ApiResponse, PaginatedResponse } from '@/types/models';

export async function fetchRestaurants(page = 1, search?: string): Promise<PaginatedResponse<Restaurant>> {
  const res = await apiClient.get<PaginatedResponse<Restaurant>>('/api/v1/restaurants', {
    params: { page, ...(search ? { search } : {}) },
  });
  return res.data;
}

export async function fetchRestaurantDetail(id: number): Promise<Restaurant> {
  const res = await apiClient.get<ApiResponse<Restaurant>>(`/api/v1/restaurants/${id}`);
  return res.data.data;
}
