import apiClient from './client';

export type SafetyCategory = 'hospital' | 'police_station' | 'rescue';

export const SAFETY_CATEGORY_LABELS: Record<SafetyCategory, string> = {
  hospital:       'Hospital',
  police_station: 'Police Station',
  rescue:         'Rescue',
};

export type SafetyLocationData = {
  id:               number;
  name:             string;
  category:         SafetyCategory;
  category_label:   string;
  sub_category:     string | null;
  sort_order:       number;
  phone:            string | null;
  location:         string | null;
  fb_page_link:     string | null;
  gmap_link:        string | null;
  description:      string | null;
  latitude:         number | null;
  longitude:        number | null;
  cover_photo_url:  string | null;
  photo_urls:       string[];
  created_at:       string;
  updated_at:       string;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; category?: SafetyCategory; search?: string };

export type SafetyLocationPayload = {
  name:           string;
  category:       SafetyCategory;
  sub_category?:  string | null;
  sort_order?:    number;
  phone?:         string | null;
  location?:      string | null;
  fb_page_link?:  string | null;
  gmap_link?:     string | null;
  description?:   string | null;
  latitude?:      number | null;
  longitude?:     number | null;
};

export const safetyApi = {
  list: async (params: ListParams = {}): Promise<{ data: SafetyLocationData[]; meta: Meta }> => {
    const res = await apiClient.get<{ data: SafetyLocationData[]; meta: Meta }>('/safety-locations', { params });
    return res.data;
  },

  get: async (id: number): Promise<SafetyLocationData> => {
    const res = await apiClient.get<{ data: SafetyLocationData }>(`/safety-locations/${id}`);
    return res.data.data;
  },

  create: async (payload: SafetyLocationPayload): Promise<SafetyLocationData> => {
    const res = await apiClient.post<{ data: SafetyLocationData }>('/safety-locations', payload);
    return res.data.data;
  },

  update: async (id: number, payload: Partial<SafetyLocationPayload>): Promise<SafetyLocationData> => {
    const res = await apiClient.put<{ data: SafetyLocationData }>(`/safety-locations/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/safety-locations/${id}`);
  },

  setCover: async (id: number, file: File): Promise<SafetyLocationData> => {
    const form = new FormData();
    form.append('photo', file);
    const res = await apiClient.post<{ data: SafetyLocationData }>(`/safety-locations/${id}/cover`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  removeCover: async (id: number): Promise<SafetyLocationData> => {
    const res = await apiClient.delete<{ data: SafetyLocationData }>(`/safety-locations/${id}/cover`);
    return res.data.data;
  },

  addPhoto: async (id: number, file: File): Promise<SafetyLocationData> => {
    const form = new FormData();
    form.append('photo', file);
    const res = await apiClient.post<{ data: SafetyLocationData }>(`/safety-locations/${id}/photos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  removePhoto: async (id: number, index: number): Promise<SafetyLocationData> => {
    const res = await apiClient.delete<{ data: SafetyLocationData }>(`/safety-locations/${id}/photos/${index}`);
    return res.data.data;
  },

  exportUrl: (category?: SafetyCategory): string => {
    const base = `${apiClient.defaults.baseURL ?? ''}/safety-locations/export`;
    return category ? `${base}?category=${category}` : base;
  },

  import: async (file: File, category?: SafetyCategory): Promise<{ count: number; message: string }> => {
    const form = new FormData();
    form.append('file', file);
    if (category) form.append('category', category);
    const res = await apiClient.post<{ count: number; message: string }>('/safety-locations/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
