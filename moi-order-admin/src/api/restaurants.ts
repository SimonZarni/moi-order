import apiClient from './client';

export type RestaurantStatus = 'open' | 'closed' | 'paused';

export type RestaurantListItem = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  status: RestaurantStatus;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  delivery_radius_km: number | null;
  food_orders_count: number;
  menu_items_count: number;
  merchant: { id: number; name: string; email: string };
  created_at: string;
};

export type OpeningHour = {
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
};

export type MenuItemDetail = {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  status: 'available' | 'unavailable';
  sort_order: number;
};

export type MenuCategoryDetail = {
  id: number;
  name: string;
  sort_order: number;
  items: MenuItemDetail[];
};

export type RestaurantDetail = RestaurantListItem & {
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_photo_url: string | null;
  logo_url: string | null;
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

export const restaurantsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: RestaurantListItem[]; meta: Meta }>('/restaurants', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient
      .get<{ data: RestaurantDetail }>(`/restaurants/${id}`)
      .then((r) => r.data.data),
  create: (payload: CreateRestaurantPayload) =>
    apiClient
      .post<{ data: RestaurantDetail }>('/restaurants', payload)
      .then((r) => r.data.data),
  update: (id: number | string, payload: UpdateRestaurantPayload) =>
    apiClient
      .put<{ data: RestaurantDetail }>(`/restaurants/${id}`, payload)
      .then((r) => r.data.data),
  remove: (id: number | string) =>
    apiClient.delete(`/restaurants/${id}`),
  updateStatus: (id: number | string, status: RestaurantStatus) =>
    apiClient
      .patch<{ data: { id: number; status: RestaurantStatus } }>(`/restaurants/${id}/status`, { status })
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
  addItem: (restaurantId: number | string, payload: ItemPayload) =>
    apiClient
      .post<{ data: MenuItemDetail }>(`/restaurants/${restaurantId}/items`, payload)
      .then((r) => r.data.data),
  updateItem: (restaurantId: number | string, itemId: number, payload: UpdateItemPayload) =>
    apiClient
      .put<{ data: MenuItemDetail }>(`/restaurants/${restaurantId}/items/${itemId}`, payload)
      .then((r) => r.data.data),
  deleteItem: (restaurantId: number | string, itemId: number) =>
    apiClient.delete(`/restaurants/${restaurantId}/items/${itemId}`),
};
