import apiClient from './client';

export type PlaceStatus = 'active' | 'inactive' | 'pending';

export type GoogleMatchStatus = 'auto_matched' | 'needs_manual' | 'verified';

export type GooglePlaceResult = {
  id: string;
  displayName: string;
  formattedAddress: string;
};

export type PlacePhotoData = {
  id: number;
  photo_url: string;
  google_photo_name: string | null;
  display_order: number;
  source: 'google' | 'manual';
  is_selected: boolean;
  width_px: number | null;
  height_px: number | null;
  author_name: string | null;
};

export type ImportBatchData = {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total: number;
  imported: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
  created_at: string;
  updated_at: string;
};

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
  categories: PlaceLocale[];
  tags: Array<{ id: number; name_my: string; name_en: string | null; slug: string }>;
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
  google_place_id: string | null;
  google_match_status: GoogleMatchStatus | null;
  cover_image: string | null;
  rating?: number;
  review_count?: number;
  images: Array<{ id: number; url: string; sort_order: number }>;
  created_at: string;
  deleted_at?: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; search?: string; status?: string };

type ExportParams = { search?: string; city?: string; category_id?: number };

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
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<{ data: ImportBatchData }>('/places/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data);
  },
  getImportStatus: (batchId: number) =>
    apiClient
      .get<{ data: ImportBatchData }>(`/places/import/${batchId}`)
      .then((r) => r.data.data),
  exportExcel: (params: ExportParams) =>
    apiClient.get<Blob>('/places/export', { params, responseType: 'blob' }).then((r) => r.data),

  // ── Google Place ID ──────────────────────────────────────────────────────────
  searchGoogle: (name: string, city: string) =>
    apiClient
      .post<{ data: GooglePlaceResult[] }>('/places/search-google', { name, city })
      .then((r) => r.data.data),

  saveGooglePlaceId: (id: number | string, googlePlaceId: string) =>
    apiClient
      .patch<{ data: { google_place_id: string; google_match_status: GoogleMatchStatus } }>(
        `/places/${id}/google-place-id`,
        { google_place_id: googlePlaceId }
      )
      .then((r) => r.data.data),

  // ── Google Photos ────────────────────────────────────────────────────────────
  getGooglePhotos: (id: number | string) =>
    apiClient
      .get<{ data: PlacePhotoData[] }>(`/places/${id}/google-photos`)
      .then((r) => r.data.data),

  fetchGooglePhotos: (id: number | string) =>
    apiClient
      .post<{ data: PlacePhotoData[] }>(`/places/${id}/google-photos/fetch`)
      .then((r) => r.data.data),

  addToGallery: (id: number | string, photoId: number) =>
    apiClient
      .post<{ data: { id: number; url: string; sort_order: number } }>(
        `/places/${id}/google-photos/${photoId}/add-to-gallery`
      )
      .then((r) => r.data.data),

  removeFromGallery: (id: number | string, photoId: number) =>
    apiClient.post(`/places/${id}/google-photos/${photoId}/remove-from-gallery`),
};
