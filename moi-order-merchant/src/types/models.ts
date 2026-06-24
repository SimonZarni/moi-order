import type { DailyInvoiceStatus, KycDocType, KycStatus, MenuItemStatus, OrderStatus, RestaurantStatus } from './enums';

export interface MerchantUser {
  id: string;     // UUID — used for identity/display
  int_id: number; // integer PK — used for Pusher channel subscription
  name: string;
  email: string | null;
  phone: string | null;
  is_merchant: boolean;
  email_verified: boolean;
  has_password: boolean;
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

export interface FoodOrderSelectedOption {
  option_group_id: number;
  option_group_name: string;
  option_id: number;
  option_name: string;
  price_cents: number;
}

export interface FoodOrderItem {
  id: number;
  menu_item_id: number | null;
  name: string;
  quantity: number;
  price_cents: number;
  additional_price_cents: number;
  subtotal_cents: number;
  notes: string | null;
  selected_options: FoodOrderSelectedOption[];
}

export interface FoodOrderUser {
  id: string;
  name: string;
  phone: string | null;
}

export interface FoodOrder {
  id: string;
  order_number: string | null;
  status: OrderStatus;
  status_label: string;
  payment_method: string;
  subtotal_cents: number;
  total_cents: number;
  delivery_address: string | null;
  customer_notes: string | null;
  contact_no: string | null;
  preparation_time_minutes: number | null;
  items: FoodOrderItem[];
  confirmed_at: string | null;
  payment_confirmed_at: string | null;
  preparing_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  edited_by_merchant_at: string | null;
  created_at: string;
  user: FoodOrderUser;
}

export interface MenuItemOption {
  id: number;
  name: string;
  additional_price_cents: number;
  is_available: boolean;
}

export interface MenuItemOptionGroup {
  id: number;
  name: string;
  is_required: boolean;
  min_selections: number;
  max_selections: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price_cents: number;
  original_price_cents: number | null;
  status: MenuItemStatus;
  photo_url: string | null;
  option_groups: MenuItemOptionGroup[];
}

export interface MenuCategory {
  id: number;
  restaurant_id: number;
  opening_hour_id: number | null;
  name: string;
  sort_order: number;
  category_type: string | null;
  is_system: boolean;
  items: MenuItem[];
}

export interface OpeningHourSession {
  id: number;
  opens_at: string;   // "HH:mm"
  closes_at: string;  // "HH:mm"
  sort_order: number;
  session_menu_categories_count: number;
  session_menu_items_count: number;
  session_menu_enabled: boolean;
}

export interface OpeningHour {
  day_of_week: number;
  is_closed: boolean;
  sessions: OpeningHourSession[];
}

export interface RestaurantPhoto {
  id: number;
  url: string;
  sort_order: number;
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
  override_active: boolean;
  override_until: string | null;
  cover_photo_url: string | null;
  logo_url: string | null;
  photos: RestaurantPhoto[];
  delivery_radius_km: number | null;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  opening_hours: OpeningHour[] | null;
}

export interface OrderChatMessage {
  id: number;
  sender_type: 'customer' | 'merchant' | 'admin' | 'system';
  sender_id: number;
  sender_name: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
  read_at?: string | null;
  reply_to_id?: number | null;
  reply_to_body?: string | null;
  reply_to_sender_name?: string | null;
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

export interface TopItem {
  name: string;
  total_quantity: number;
  revenue_cents: number;
}

export interface TopCustomer {
  name: string;
  order_count: number;
  total_cents: number;
}

export interface TopData {
  top_items: TopItem[];
  top_customers: TopCustomer[];
}

// ── Analytics chart (time-series) ─────────────────────────────────────────────

export interface AnalyticsChartPoint {
  label: string;
  revenue_cents: number;
  order_count: number;
}

export type AnalyticsPeriod = 'all' | 'today' | 'week' | 'month';

export interface AnalyticsChartData {
  period: 'today' | 'week' | 'month';
  points: AnalyticsChartPoint[];
}

// ── Merchant in-app notifications ─────────────────────────────────────────────

export type MerchantNotificationType = 'new_order' | 'order_status' | 'chat_message' | 'system';

export interface MerchantNotification {
  id: number;
  type: MerchantNotificationType;
  title: string;
  body: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

// ── Business profile ─────────────────────────────────────────────────────────

export interface BusinessProfileUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface BusinessProfileRestaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  status: RestaurantStatus;
  status_label: string;
  cover_photo_url: string | null;
  logo_url: string | null;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  delivery_radius_km: number | null;
}

export interface BusinessProfile {
  user: BusinessProfileUser;
  kyc: KycApplication | null;
  restaurant: BusinessProfileRestaurant | null;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface DailyInvoiceRestaurant {
  id: number;
  name: string;
  payment_qr_url: string | null;
  has_payment_qr: boolean;
}

export interface DailyInvoice {
  id: number | null;
  date: string;
  order_count: number;
  customer_total_cents: number;
  platform_fee_cents: number;
  payout_cents: number;
  status: DailyInvoiceStatus;
  status_label: string;
  is_provisional: boolean;
  paid_at: string | null;
  confirmed_by_id: number | null;
  created_at: string | null;
  restaurant?: DailyInvoiceRestaurant;
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
