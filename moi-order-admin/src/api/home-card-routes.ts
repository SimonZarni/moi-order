import type { HomeCardRoute } from 'src/types';

import apiClient from './client';

// ----------------------------------------------------------------------

export type HomeCardRoutePayload = {
  key: string;
  label_en: string;
  label_mm: string;
  type: 'internal' | 'external_url';
  url?: string | null;
};

// ----------------------------------------------------------------------

export const homeCardRoutesApi = {
  list: () =>
    apiClient
      .get<{ data: HomeCardRoute[] }>('/home-card-routes')
      .then((r) => r.data.data),

  create: (payload: HomeCardRoutePayload) =>
    apiClient
      .post<{ data: HomeCardRoute }>('/home-card-routes', payload)
      .then((r) => r.data.data),
};
