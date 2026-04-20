import apiClient from './client';

export type PlaceStatus = 'active' | 'inactive' | 'pending';

export type PlaceLocale = {
  id: number;
  name_my: string;
  name_en: string | null;
  name_th: string | null;
  slug: string;
};

export type PlaceData = {
  id: number;
  name_my: string;
  name_en: string | null;
  name_th: string | null;
  category: PlaceLocale | null;
  city: string | null;
  address: string;
  short_description: string | null;
  long_description: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  contact_phone: string | null;
  website: string | null;
  google_map_url: string | null;
  cover_image: string | null;
  rating?: number;
  review_count?: number;
  images: Array<{ id: number; url: string; sort_order: number }>;
  created_at: string;
  deleted_at?: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; search?: string; status?: string };

export const placesApi = {
  list: (params: ListParams) =>
    apiClient.get<{ data: PlaceData[]; meta: Meta }>('/places', { params }).then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: PlaceData }>(`/places/${id}`).then((r) => r.data.data),
  create: (payload: Record<string, unknown>) =>
    apiClient.post<{ data: PlaceData }>('/places', payload).then((r) => r.data.data),
  update: (id: number | string, payload: Record<string, unknown>) =>
    apiClient.put<{ data: PlaceData }>(`/places/${id}`, payload).then((r) => r.data.data),
  remove: (id: number | string) => apiClient.delete(`/places/${id}`),
  uploadImages: (id: number | string, files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('images[]', f));
    return apiClient
      .post<{ data: Array<{ id: number; url: string; sort_order: number }> }>(
        `/places/${id}/images`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      .then((r) => r.data.data);
  },
  deleteImage: (id: number | string, imageId: number) =>
    apiClient.delete(`/places/${id}/images/${imageId}`),
};
