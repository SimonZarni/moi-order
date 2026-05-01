import type { Restaurant } from '../types/models';
import { apiClient } from './client';

export async function getRestaurant(): Promise<Restaurant> {
  const response = await apiClient.get<{ data: Restaurant }>('/restaurant');
  return response.data.data;
}

export async function updateRestaurant(
  data: Partial<Pick<Restaurant, 'name' | 'description' | 'address'>>,
): Promise<Restaurant> {
  const response = await apiClient.patch<{ data: Restaurant }>(
    '/restaurant',
    data,
  );
  return response.data.data;
}

export async function uploadRestaurantPhoto(
  field: 'cover_photo' | 'logo',
  formData: FormData,
): Promise<Restaurant> {
  const response = await apiClient.post<{ data: Restaurant }>(
    `/restaurant/${field}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}
