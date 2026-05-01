import apiClient from './client';

import type { ApiResponse, Restaurant } from 'src/types';

// ----------------------------------------------------------------------

export async function fetchRestaurant(): Promise<Restaurant | null> {
  const res = await apiClient.get<ApiResponse<Restaurant | null>>('/restaurant');
  return res.data.data;
}

export async function updateRestaurant(
  payload: Partial<Restaurant>,
  coverPhoto?: File | null,
  logo?: File | null
): Promise<Restaurant> {
  if (coverPhoto || logo) {
    const fd = new FormData();
    fd.append('_method', 'PUT');
    const entries = Object.entries(payload) as [string, unknown][];
    for (const [key, value] of entries) {
      if (key === 'opening_hours') {
        fd.append(key, JSON.stringify(value));
      } else if (value != null) {
        fd.append(key, String(value));
      }
    }
    if (coverPhoto) fd.append('cover_photo', coverPhoto);
    if (logo) fd.append('logo', logo);
    const res = await apiClient.post<ApiResponse<Restaurant>>('/restaurant', fd, {
      headers: { 'Content-Type': undefined },
    });
    return res.data.data;
  }
  const res = await apiClient.put<ApiResponse<Restaurant>>('/restaurant', payload);
  return res.data.data;
}
