import apiClient from './client';

export type RestaurantStatus = 'open' | 'closed' | 'paused';
export type RestaurantPlatformStatus = 'active' | 'suspended';

export type RestaurantListItem = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  status: RestaurantStatus;
  platform_status: RestaurantPlatformStatus;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  delivery_radius_km: number | null;
  food_orders_count: number;
  menu_items_count: number;
  merchant: { id: number; name: string; email: string };
  created_at: string;
};

export type OpeningHourSession = {
  opens_at: string;
  closes_at: string;
  sort_order: number;
};

export type OpeningHour = {
  day_of_week: number;
  is_closed: boolean;
  sessions: OpeningHourSession[];
};

export type MenuItemDetail = {
  id: number;
  menu_category_id: number;
  name: string;
  description: string | null;
  price_cents: number;
  photo_url: string | null;
  status: 'available' | 'unavailable';
  sort_order: number;
};

export type MenuCategoryDetail = {
  id: number;
  name: string;
  sort_order: number;
  items: MenuItemDetail[];
};

export type RestaurantPhoto = {
  id: number;
  url: string;
  sort_order: number;
};

export type RestaurantDetail = RestaurantListItem & {
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_photo_url: string | null;
  logo_url: string | null;
  photos: RestaurantPhoto[];
  opening_hours: OpeningHour[];
  menu: MenuCategoryDetail[];
};

export type CreateRestaurantPayload = {
  user_id: number;
  name: string;
  description?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  delivery_radius_km?: number | null;
  status?: RestaurantStatus;
  opening_hours?: OpeningHour[];
};

export type UpdateRestaurantPayload = Partial<Omit<CreateRestaurantPayload, 'user_id'>>;

export type CategoryPayload = { name: string; sort_order?: number };

export type ItemPayload = {
  menu_category_id: number;
  name: string;
  description?: string;
  price_cents: number;
  status?: 'available' | 'unavailable';
  sort_order?: number;
};

export type UpdateItemPayload = Partial<ItemPayload>;

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type ListParams = { page?: number; per_page?: number; status?: string; search?: string };

// Build FormData from a plain payload object, appending non-null values as strings.
// Pass Content-Type: undefined so axios lets the browser set multipart boundary.
function buildFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) fd.append(k, String(v));
  });
  return fd;
}

const multipart = { headers: { 'Content-Type': undefined } } as const;

export const restaurantsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: RestaurantListItem[]; meta: Meta }>('/restaurants', { params })
      .then((r) => r.data),

  get: (id: number | string) =>
    apiClient
      .get<{ data: RestaurantDetail }>(`/restaurants/${id}`)
      .then((r) => r.data.data),

  create: (payload: CreateRestaurantPayload, coverPhoto?: File | null, logo?: File | null) => {
    if (coverPhoto || logo) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>);
      if (payload.opening_hours) {
        // FormData can't serialize nested arrays — re-append as JSON
        fd.delete('opening_hours');
        fd.append('opening_hours', JSON.stringify(payload.opening_hours));
      }
      if (coverPhoto) fd.append('cover_photo', coverPhoto);
      if (logo) fd.append('logo', logo);
      return apiClient.post<{ data: RestaurantDetail }>('/restaurants', fd, multipart).then((r) => r.data.data);
    }
    return apiClient.post<{ data: RestaurantDetail }>('/restaurants', payload).then((r) => r.data.data);
  },

  update: (id: number | string, payload: UpdateRestaurantPayload, coverPhoto?: File | null, logo?: File | null) => {
    if (coverPhoto || logo) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>);
      if (payload.opening_hours) {
        fd.delete('opening_hours');
        fd.append('opening_hours', JSON.stringify(payload.opening_hours));
      }
      if (coverPhoto) fd.append('cover_photo', coverPhoto);
      if (logo) fd.append('logo', logo);
      // PHP only populates $_FILES for POST — spoof PUT via _method
      fd.append('_method', 'PUT');
      return apiClient.post<{ data: RestaurantDetail }>(`/restaurants/${id}`, fd, multipart).then((r) => r.data.data);
    }
    return apiClient.put<{ data: RestaurantDetail }>(`/restaurants/${id}`, payload).then((r) => r.data.data);
  },

  remove: (id: number | string) =>
    apiClient.delete(`/restaurants/${id}`),

  updateStatus: (id: number | string, status: RestaurantStatus) =>
    apiClient
      .patch<{ data: { id: number; status: RestaurantStatus } }>(`/restaurants/${id}/status`, { status })
      .then((r) => r.data.data),

  updatePlatformStatus: (id: number | string, platform_status: RestaurantPlatformStatus) =>
    apiClient
      .patch<{ data: { id: number; platform_status: RestaurantPlatformStatus } }>(`/restaurants/${id}/platform-status`, { platform_status })
      .then((r) => r.data.data),

  // ─── Categories ──────────────────────────────────────────────────────────
  addCategory: (restaurantId: number | string, payload: CategoryPayload) =>
    apiClient
      .post<{ data: MenuCategoryDetail }>(`/restaurants/${restaurantId}/categories`, payload)
      .then((r) => r.data.data),

  updateCategory: (restaurantId: number | string, categoryId: number, payload: CategoryPayload) =>
    apiClient
      .put<{ data: MenuCategoryDetail }>(`/restaurants/${restaurantId}/categories/${categoryId}`, payload)
      .then((r) => r.data.data),

  deleteCategory: (restaurantId: number | string, categoryId: number) =>
    apiClient.delete(`/restaurants/${restaurantId}/categories/${categoryId}`),

  // ─── Items ────────────────────────────────────────────────────────────────
  addItem: (restaurantId: number | string, payload: ItemPayload, photo?: File | null) => {
    if (photo) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>);
      fd.append('photo', photo);
      return apiClient
        .post<{ data: MenuItemDetail }>(`/restaurants/${restaurantId}/items`, fd, multipart)
        .then((r) => r.data.data);
    }
    return apiClient
      .post<{ data: MenuItemDetail }>(`/restaurants/${restaurantId}/items`, payload)
      .then((r) => r.data.data);
  },

  updateItem: (restaurantId: number | string, itemId: number, payload: UpdateItemPayload, photo?: File | null) => {
    if (photo) {
      const fd = buildFormData(payload as unknown as Record<string, unknown>);
      fd.append('photo', photo);
      // PHP only populates $_FILES for POST — spoof PUT via _method
      fd.append('_method', 'PUT');
      return apiClient
        .post<{ data: MenuItemDetail }>(`/restaurants/${restaurantId}/items/${itemId}`, fd, multipart)
        .then((r) => r.data.data);
    }
    return apiClient
      .put<{ data: MenuItemDetail }>(`/restaurants/${restaurantId}/items/${itemId}`, payload)
      .then((r) => r.data.data);
  },

  deleteItem: (restaurantId: number | string, itemId: number) =>
    apiClient.delete(`/restaurants/${restaurantId}/items/${itemId}`),

  // ─── Gallery photos ─────────────────────────────────────────────────────────
  addGalleryPhoto: (restaurantId: number | string, photo: File) => {
    const fd = new FormData();
    fd.append('photo', photo);
    return apiClient
      .post<{ data: RestaurantDetail }>(`/restaurants/${restaurantId}/photos`, fd, multipart)
      .then((r) => r.data.data);
  },

  deleteGalleryPhoto: (restaurantId: number | string, photoId: number) =>
    apiClient
      .delete<{ data: RestaurantDetail }>(`/restaurants/${restaurantId}/photos/${photoId}`)
      .then((r) => r.data.data),

  reorderGalleryPhotos: (restaurantId: number | string, ids: number[]) =>
    apiClient
      .patch<{ data: RestaurantDetail }>(`/restaurants/${restaurantId}/photos/reorder`, { ids })
      .then((r) => r.data.data),
};
