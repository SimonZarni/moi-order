import apiClient from './client';

export type CategoryData = {
  id: number;
  slug: string;
  name_my: string;
  name_en: string | null;
  name_th: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

export const categoriesApi = {
  list: (params?: { per_page?: number }) =>
    apiClient
      .get<{ data: CategoryData[]; meta: Meta }>('/categories', { params })
      .then((r) => r.data),
};
