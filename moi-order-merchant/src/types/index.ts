// ----------------------------------------------------------------------
// Domain enums
// ----------------------------------------------------------------------

export type FoodOrderStatus =
  | 'order_placed'
  | 'waiting_for_payment'
  | 'payment_confirmed'
  | 'preparing_food'
  | 'waiting_for_delivery'
  | 'delivery_on_the_way'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type FoodPaymentMethod = 'cod' | 'prompt_pay';

export type RestaurantStatus = 'open' | 'closed' | 'paused';

export type MenuItemStatus = 'available' | 'unavailable';

// ----------------------------------------------------------------------
// Auth
// ----------------------------------------------------------------------

export interface MerchantUser {
  id: number;
  name: string;
  email: string;
}

// ----------------------------------------------------------------------
// Restaurant
// ----------------------------------------------------------------------

export interface OpeningHour {
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_photo_url: string | null;
  logo_url: string | null;
  status: RestaurantStatus;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  delivery_radius_km: number | null;
  opening_hours: OpeningHour[];
}

// ----------------------------------------------------------------------
// Menu
// ----------------------------------------------------------------------

export interface MenuItemDetail {
  id: number;
  menu_category_id: number;
  name: string;
  description: string | null;
  price_cents: number;
  photo_url: string | null;
  status: MenuItemStatus;
  sort_order: number;
}

export interface MenuCategoryDetail {
  id: number;
  name: string;
  sort_order: number;
  items: MenuItemDetail[];
}

// ----------------------------------------------------------------------
// Orders
// ----------------------------------------------------------------------

export interface FoodOrderItem {
  id: number;
  name: string;
  quantity: number;
  price_cents: number;
  subtotal_cents: number;
  notes: string | null;
}

export interface FoodOrder {
  id: number;
  order_number: string | null;
  status: FoodOrderStatus;
  status_label: string;
  payment_method: FoodPaymentMethod;
  total_cents: number;
  delivery_address: string | null;
  customer_notes: string | null;
  items?: FoodOrderItem[];
  confirmed_at: string | null;
  created_at: string;
}

// ----------------------------------------------------------------------
// API response shapes
// ----------------------------------------------------------------------

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

// ----------------------------------------------------------------------
// Item payload helper (used by menu API functions)
// ----------------------------------------------------------------------

export interface ItemPayload {
  name: string;
  description?: string | null;
  price_cents: number;
  status: MenuItemStatus;
  sort_order?: number;
}
