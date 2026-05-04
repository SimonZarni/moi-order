import type { PlaceCategory } from 'src/types';

import apiClient from './client';

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type ListParams = { page?: number; per_page?: number };

type CategoryPayload = {
  name_my: string;
  name_en: string;
  name_th: string | null;
  slug: string;
};

export const categoriesApi = {
  list: (params?: ListParams) =>
    apiClient
      .get<{ data: PlaceCategory[]; meta: Meta }>('/categories', { params })
      .then((r) => r.data),

  create: (payload: CategoryPayload) =>
    apiClient.post<{ data: PlaceCategory }>('/categories', payload).then((r) => r.data.data),

  update: (id: number, payload: CategoryPayload) =>
    apiClient.put<{ data: PlaceCategory }>(`/categories/${id}`, payload).then((r) => r.data.data),

  destroy: (id: number) => apiClient.delete(`/categories/${id}`),

  restore: (id: number) =>
    apiClient
      .patch<{ data: PlaceCategory }>(`/categories/${id}/restore`)
      .then((r) => r.data.data),
};
