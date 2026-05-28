import type { Restaurant } from '../types/models';
import type { RestaurantStatus } from '../types/enums';
import { apiClient } from './client';

export interface OpeningHourInput {
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
}

export interface UpdateRestaurantPayload {
  description?: string;
  phone?: string;
  status?: RestaurantStatus;
  delivery_radius_km?: number | null;
  is_delivery_available?: boolean;
  is_pickup_available?: boolean;
  min_order_cents?: number;
  opening_hours?: OpeningHourInput[];
}

export interface RestaurantPrefill {
  name: string;
  address: string | null;
  phone: string | null;
}

export interface GetRestaurantResult {
  restaurant: Restaurant | null;
  prefill: RestaurantPrefill | null;
}

export async function getRestaurant(): Promise<GetRestaurantResult> {
  const response = await apiClient.get<{ data: Restaurant | null; prefill?: RestaurantPrefill | null }>('/restaurant');
  return { restaurant: response.data.data, prefill: response.data.prefill ?? null };
}

export async function createRestaurant(data: UpdateRestaurantPayload): Promise<Restaurant> {
  const response = await apiClient.post<{ data: Restaurant }>('/restaurant', data);
  return response.data.data;
}

export async function updateRestaurant(
  data: UpdateRestaurantPayload,
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

export async function removeRestaurantPhoto(
  field: 'cover_photo' | 'logo',
): Promise<Restaurant> {
  const response = await apiClient.delete<{ data: Restaurant }>(
    `/restaurant/${field}`,
  );
  return response.data.data;
}
