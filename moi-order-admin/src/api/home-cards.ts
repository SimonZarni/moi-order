import type { HomeCard, HomeCardIconKey, HomeCardNavigationScreen } from 'src/types';

import apiClient from './client';

// ----------------------------------------------------------------------

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number };

export type HomeCardPayload = {
  slug: string;
  title_en: string;
  title_mm: string;
  subtitle_en: string | null;
  subtitle_mm: string | null;
  tag_en: string;
  tag_mm: string;
  accent_color: string;
  icon_key: HomeCardIconKey;
  navigation_screen: HomeCardNavigationScreen;
  navigation_params: Record<string, unknown> | null;
  is_active: boolean;
  is_coming_soon: boolean;
};

// ----------------------------------------------------------------------

export const homeCardsApi = {
  list: (params?: ListParams) =>
    apiClient
      .get<{ data: HomeCard[]; meta: Meta }>('/admin/v1/home-cards', { params })
      .then((r) => r.data),

  get: (id: number) =>
    apiClient
      .get<{ data: HomeCard }>(`/admin/v1/home-cards/${id}`)
      .then((r) => r.data.data),

  create: (payload: HomeCardPayload) =>
    apiClient
      .post<{ data: HomeCard }>('/admin/v1/home-cards', payload)
      .then((r) => r.data.data),

  update: (id: number, payload: HomeCardPayload) =>
    apiClient
      .put<{ data: HomeCard }>(`/admin/v1/home-cards/${id}`, payload)
      .then((r) => r.data.data),

  remove: (id: number) => apiClient.delete(`/admin/v1/home-cards/${id}`),

  restore: (id: number) =>
    apiClient
      .patch<{ data: HomeCard }>(`/admin/v1/home-cards/${id}/restore`)
      .then((r) => r.data.data),

  reorder: (order: number[]) =>
    apiClient.put('/admin/v1/home-cards/reorder', { order }).then((r) => r.data),
};
