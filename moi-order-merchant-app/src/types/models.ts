import type { KycDocType, KycStatus, MenuItemStatus, OrderStatus, RestaurantStatus } from './enums';

export interface MerchantUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_merchant: boolean;
  kyc_status: KycStatus | null;
  created_at: string;
}

export interface KycDocument {
  id: number;
  type: KycDocType;
  type_label: string;
  url: string;
  created_at: string;
}

export interface KycApplication {
  id: number;
  business_name: string;
  business_type: string;
  business_address: string;
  business_phone: string | null;
  status: KycStatus;
  status_label: string;
  review_notes: string | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  documents: KycDocument[];
  created_at: string;
}

export interface FoodOrderItem {
  id: number;
  name: string;
  quantity: number;
  price_cents: number;
  subtotal_cents: number;
  notes: string | null;
}

export interface FoodOrderUser {
  id: number;
  name: string;
  phone: string | null;
}

export interface FoodOrder {
  id: number;
  order_number: string | null;
  status: OrderStatus;
  status_label: string;
  payment_method: string;
  subtotal_cents: number;
  total_cents: number;
  delivery_address: string | null;
  customer_notes: string | null;
  items: FoodOrderItem[];
  confirmed_at: string | null;
  payment_confirmed_at: string | null;
  preparing_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  user: FoodOrderUser;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  status: MenuItemStatus;
  photo_url: string | null;
}

export interface MenuCategory {
  id: number;
  name: string;
  items: MenuItem[];
}

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
  status: RestaurantStatus;
  cover_photo_url: string | null;
  logo_url: string | null;
  delivery_radius_km: number | null;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  opening_hours: OpeningHour[] | null;
}

export interface OrderChatMessage {
  id: number;
  sender_type: 'customer' | 'merchant' | 'admin';
  sender_id: number;
  sender_name: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
}

export interface PeriodStats {
  order_count: number;
  revenue_cents: number;
}

export interface AnalyticsData {
  today: PeriodStats;
  this_week: PeriodStats;
  this_month: PeriodStats;
  pending_count: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
