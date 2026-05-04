import type { PlaceTag } from 'src/types';

import apiClient from './client';

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type ListParams = { page?: number; per_page?: number };

type TagPayload = {
  name_my: string;
  name_en: string;
  name_th: string | null;
  slug: string;
};

export const tagsApi = {
  list: (params?: ListParams) =>
    apiClient
      .get<{ data: PlaceTag[]; meta: Meta }>('/tags', { params })
      .then((r) => r.data),

  create: (payload: TagPayload) =>
    apiClient.post<{ data: PlaceTag }>('/tags', payload).then((r) => r.data.data),

  update: (id: number, payload: TagPayload) =>
    apiClient.put<{ data: PlaceTag }>(`/tags/${id}`, payload).then((r) => r.data.data),

  destroy: (id: number) => apiClient.delete(`/tags/${id}`),

  restore: (id: number) =>
    apiClient.patch<{ data: PlaceTag }>(`/tags/${id}/restore`).then((r) => r.data.data),
};
