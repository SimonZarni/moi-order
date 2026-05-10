import apiClient from './client';

export type ServiceFieldData = {
  key: string;
  label: string;
  label_en: string | null;
  label_mm: string | null;
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
  position: number;
  service_category_id: number | null;
  service_category_slug: string | null;
  types_count: number | null;
  types?: ServiceTypeData[];
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
  position: number;
  field_schema: ServiceFieldData[];
  created_at: string;
  deleted_at: string | null;
};

export type ServiceCategoryData = {
  id: number;
  name: string;
  name_en: string | null;
  name_mm: string | null;
  slug: string;
  navigation_screen: string | null;
  is_active: boolean;
  services: ServiceData[];
};

export const servicesApi = {
  list: () =>
    apiClient.get<{ data: ServiceData[] }>('/services').then((r) => r.data.data),
  get: (id: number | string) =>
    apiClient.get<{ data: ServiceData }>(`/services/${id}`).then((r) => r.data.data),
  getBySlug: (slug: string) =>
    apiClient.get<{ data: ServiceData }>(`/services/slug/${slug}`).then((r) => r.data.data),
  toggle: (id: number | string) =>
    apiClient.patch<{ data: ServiceData }>(`/services/${id}/toggle`).then((r) => r.data.data),
  create: (payload: Record<string, unknown>) =>
    apiClient.post<{ data: ServiceData }>('/services', payload).then((r) => r.data.data),
  update: (id: number | string, payload: Record<string, unknown>) =>
    apiClient.put<{ data: ServiceData }>(`/services/${id}`, payload).then((r) => r.data.data),
  remove: (id: number | string) => apiClient.delete(`/services/${id}`),
  listTypes: (serviceId: number | string) =>
    apiClient
      .get<{ data: ServiceTypeData[] }>(`/services/${serviceId}/types`)
      .then((r) => r.data.data),
  reorderTypes: (serviceId: number | string, order: number[]) =>
    apiClient.put(`/services/${serviceId}/types/reorder`, { order }),
  toggleType: (serviceId: number | string, typeId: number | string) =>
    apiClient
      .patch<{ data: ServiceTypeData }>(`/services/${serviceId}/types/${typeId}/toggle`)
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

export const serviceCategoriesApi = {
  list: () =>
    apiClient
      .get<{ data: ServiceCategoryData[] }>('/service-categories')
      .then((r) => r.data.data),
  get: (slug: string) =>
    apiClient
      .get<{ data: ServiceCategoryData }>(`/service-categories/${slug}`)
      .then((r) => r.data.data),
  create: (payload: Record<string, unknown>) =>
    apiClient
      .post<{ data: ServiceCategoryData }>('/service-categories', payload)
      .then((r) => r.data.data),
  update: (slug: string, payload: Record<string, unknown>) =>
    apiClient
      .put<{ data: ServiceCategoryData }>(`/service-categories/${slug}`, payload)
      .then((r) => r.data.data),
  reorderServices: (slug: string, order: number[]) =>
    apiClient.put(`/service-categories/${slug}/services/reorder`, { order }),
};
