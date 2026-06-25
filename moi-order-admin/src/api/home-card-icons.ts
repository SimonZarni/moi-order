import type { HomeCardIcon } from 'src/types';

import apiClient from './client';

// ----------------------------------------------------------------------

export const homeCardIconsApi = {
  list: () =>
    apiClient
      .get<{ data: HomeCardIcon[] }>('/home-card-icons')
      .then((r) => r.data.data),

  create: (formData: FormData) =>
    apiClient
      .post<{ data: HomeCardIcon }>('/home-card-icons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data),

  delete: (id: number) =>
    apiClient.delete(`/home-card-icons/${id}`).then(() => undefined),
};
