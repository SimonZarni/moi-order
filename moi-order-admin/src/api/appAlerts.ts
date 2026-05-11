import apiClient from './client';

// ----------------------------------------------------------------------

export type InAppAlert = {
  id: number;
  title: string;
  message: string;
  image_url: string | null;
  frequency: 'once_per_day' | 'every_open';
  is_active: boolean;
  created_by: { id: string; name: string } | null;
  created_at: string;
  updated_at: string;
};

export type InAppAlertPayload = {
  title: string;
  message: string;
  frequency: 'once_per_day' | 'every_open';
  is_active: boolean;
};

// ----------------------------------------------------------------------

export const appAlertsApi = {
  list: () =>
    apiClient
      .get<{ data: InAppAlert[] }>('/in-app-alerts')
      .then((r) => r.data.data),

  store: (payload: InAppAlertPayload) =>
    apiClient
      .post<{ data: InAppAlert }>('/in-app-alerts', payload)
      .then((r) => r.data.data),

  update: (id: number, payload: InAppAlertPayload) =>
    apiClient
      .put<{ data: InAppAlert }>(`/in-app-alerts/${id}`, payload)
      .then((r) => r.data.data),

  activate: (id: number) =>
    apiClient
      .patch<{ data: InAppAlert }>(`/in-app-alerts/${id}/activate`)
      .then((r) => r.data.data),

  deactivate: (id: number) =>
    apiClient
      .patch<{ data: InAppAlert }>(`/in-app-alerts/${id}/deactivate`)
      .then((r) => r.data.data),

  uploadImage: (id: number, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiClient
      .post<{ data: InAppAlert }>(`/in-app-alerts/${id}/image`, fd)
      .then((r) => r.data.data);
  },

  removeImage: (id: number) =>
    apiClient
      .delete<{ data: InAppAlert }>(`/in-app-alerts/${id}/image`)
      .then((r) => r.data.data),

  destroy: (id: number) => apiClient.delete(`/in-app-alerts/${id}`),
};
