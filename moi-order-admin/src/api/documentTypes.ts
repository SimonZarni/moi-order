import apiClient from './client';

export type DocumentTypeData = {
  id: number;
  slug: string;
  name_en: string;
  name_mm: string | null;
  is_active: boolean;
  created_at: string;
  deleted_at: string | null;
};

export const documentTypesApi = {
  list: (params?: { per_page?: number }) =>
    apiClient.get<{ data: DocumentTypeData[] }>('/document-types', { params }).then((r) => r.data.data),

  all: () =>
    apiClient.get<{ data: DocumentTypeData[] }>('/document-types', { params: { all: 1 } }).then((r) => r.data.data),

  create: (payload: { slug: string; name_en: string; name_mm?: string; is_active: boolean }) =>
    apiClient.post<{ data: DocumentTypeData }>('/document-types', payload).then((r) => r.data.data),

  update: (id: number, payload: { name_en: string; name_mm?: string; is_active: boolean }) =>
    apiClient.put<{ data: DocumentTypeData }>(`/document-types/${id}`, payload).then((r) => r.data.data),

  remove: (id: number) => apiClient.delete(`/document-types/${id}`),

  restore: (id: number) => apiClient.patch<{ data: DocumentTypeData }>(`/document-types/${id}/restore`).then((r) => r.data.data),
};
