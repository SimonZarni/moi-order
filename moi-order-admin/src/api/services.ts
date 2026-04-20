import apiClient from './client';

export type ServiceFieldData = {
  key: string;
  label: string;
  label_en: string | null;
  type: string;
  required: boolean;
  sort_order: number;
  options?: string[];
  document_type?: string | null;
};

export type ServiceData = {
  id: number;
  name: string;
  name_en: string | null;
  name_mm: string | null;
  slug: string;
  is_active: boolean;
  types_count: number | null;
  created_at: string;
  deleted_at: string | null;
};

export type ServiceTypeData = {
  id: number;
  service_id: number;
  name: string;
  name_en: string | null;
  name_mm: string | null;
  price: number;
  is_active: boolean;
  field_schema: ServiceFieldData[];
  created_at: string;
  deleted_at: string | null;
};

export const servicesApi = {
  list: () =>
    apiClient.get<{ data: ServiceData[] }>('/services').then((r) => r.data.data),
  get: (id: number | string) =>
    apiClient.get<{ data: ServiceData }>(`/services/${id}`).then((r) => r.data.data),
  create: (payload: Record<string, unknown>) =>
    apiClient.post<{ data: ServiceData }>('/services', payload).then((r) => r.data.data),
  update: (id: number | string, payload: Record<string, unknown>) =>
    apiClient.put<{ data: ServiceData }>(`/services/${id}`, payload).then((r) => r.data.data),
  remove: (id: number | string) => apiClient.delete(`/services/${id}`),
  listTypes: (serviceId: number | string) =>
    apiClient
      .get<{ data: ServiceTypeData[] }>(`/services/${serviceId}/types`)
      .then((r) => r.data.data),
  createType: (serviceId: number | string, payload: Record<string, unknown>) =>
    apiClient
      .post<{ data: ServiceTypeData }>(`/services/${serviceId}/types`, payload)
      .then((r) => r.data.data),
  updateType: (serviceId: number | string, typeId: number | string, payload: Record<string, unknown>) =>
    apiClient
      .put<{ data: ServiceTypeData }>(`/services/${serviceId}/types/${typeId}`, payload)
      .then((r) => r.data.data),
  removeType: (serviceId: number | string, typeId: number | string) =>
    apiClient.delete(`/services/${serviceId}/types/${typeId}`),
};
