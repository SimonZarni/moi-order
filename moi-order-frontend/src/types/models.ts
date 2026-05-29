// More interfaces added here as features are built

export interface Category {
  id: number;
  name_my: string;
  name_en: string;
  name_th: string;
  slug: string;
}

export interface Tag {
  id: number;
  name_my: string;
  name_en: string;
  name_th: string;
  slug: string;
}

export interface PlaceImage {
  id: number;
  url: string;
  sort_order: number;
}

export interface Place {
  id: number;
  name_my: string;
  name_en: string;
  name_th: string;
  short_description: string;
  long_description: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  contact_phone: string | null;
  website: string | null;
  google_map_url: string | null;
  cover_image: string | null;
  categories: Category[];
  /** Present on both list and detail endpoints. */
  tags: Tag[];
  /** Only present on the detail endpoint (/places/:id). List uses cover_image instead. */
  images?: PlaceImage[];
}

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  phone_number: string | null;
  profile_picture_url: string | null;
  has_password: boolean;
  has_google: boolean;
  has_apple: boolean;
  has_line: boolean;
  line_handle: string | null;    // user-entered LINE ID (e.g. "chrisline"), null if not set
  date_of_birth: string | null;  // ISO date "YYYY-MM-DD"
  role: string;
  is_privileged: boolean;
  simulated_date: string | null;  // ISO date "YYYY-MM-DD" — privileged accounts only
  email_verified_at: string | null;
  created_at: string;
}

export interface UploadSectionStats {
  today_used: number;
  daily_limit: number | null;  // null = unlimited (privileged)
  total_count: number;
}

export interface UploadStats {
  is_privileged: boolean;
  monthly_used: number;
  monthly_limit: number | null;
  monthly_remaining: number | null;
  reset_date: string | null;  // "YYYY-MM-DD"
  sections: {
    passport:          UploadSectionStats;
    ninety_day_report: UploadSectionStats;
    other:             UploadSectionStats;
  };
}

export interface VerificationStatus {
  connected_channels: number;   // need ≥ 2
  successful_payments: number;  // need ≥ 3
  is_verified: boolean;
}

// ── Services ───────────────────────────────────────────────────────────────

export interface FieldSchemaItem {
  key: string;
  label: string;        // Thai
  label_en: string;     // English
  label_mm?: string;    // Myanmar (nullable)
  type: import('./enums').FieldType;
  required: boolean;
  sort_order: number;
  options?: string[];       // present when type === 'select'
  accepts?: string[];       // present when type === 'file' — e.g. ['image', 'pdf']
  document_type?: string; // slug — required when type === 'file'
}

export interface ServiceType {
  id: number;
  name: string;
  name_en: string;
  name_mm: string | null;
  price: number; // whole THB
  field_schema: FieldSchemaItem[];
  // Present only when the parent service relation is loaded (detail endpoint)
  service?: {
    id: number;
    name: string;
    name_en: string;
    name_mm: string | null;
  };
}

export interface ServiceCategory {
  id: number;
  name: string;
  name_en: string;
  name_mm: string | null;
  slug: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
  name_en: string;
  name_mm: string | null;
  slug: string;
  service_category_slug: string | null;
  types: ServiceType[];
}

// ── Submissions ────────────────────────────────────────────────────────────

export interface SubmissionDocument {
  id: number;
  document_type: string;
  label: string;
  label_mm: string;
  signed_url: string;
}

export interface Payment {
  id: string; // UUID
  status: string;
  status_label: string;
  amount: number;      // satangs (divide by 100 for THB display)
  currency: string;
  qr_image_url: string | null;
  qr_data: string | null;
  expires_at: string | null;
}

export interface ServiceSubmission {
  id: string; // UUID
  status: string;
  status_label: string;
  payment_authorized: boolean;
  price_snapshot: number; // whole THB
  completed_at: string | null;
  created_at: string;
  has_result: boolean;
  service_type: ServiceType | null;
  documents?: SubmissionDocument[];
  payment?: Payment;
  /** All submission fields. Text values are strings; file fields are signed URLs. */
  submission_data?: Record<string, string | number | boolean>;
}

// ── Tickets ────────────────────────────────────────────────────────────────

export interface TicketVariant {
  id: number;
  name: string;
  description: string | null;
  price: number; // whole THB
  sort_order: number;
}

export interface TicketImage {
  id: number;
  url: string;
  sort_order: number;
}

export interface Ticket {
  id: number;
  name: string;
  highlight_description: string;
  description: string;
  google_maps_link: string;
  address: string;
  city: string;
  province: string;
  cover_image_url: string;
  /** Present on list endpoint only (variants not loaded). */
  starting_from_price?: number;
  /** Present on detail endpoint only. */
  variants?: TicketVariant[];
  /** Present on detail endpoint only — sorted gallery images. */
  images?: TicketImage[];
}

export interface TicketOrderItem {
  id: number;
  quantity: number;
  price_snapshot: number; // whole THB
  subtotal: number;       // whole THB
  variant?: {
    id: number;
    name: string;
  };
}

export interface TicketOrder {
  id: string; // UUID
  status: string;
  status_label: string;
  payment_authorized: boolean;
  visit_date: string; // "YYYY-MM-DD"
  total?: number;     // whole THB — present when items are loaded
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  has_eticket: boolean;
  ticket?: {
    id: number;
    name: string;
  };
  items?: TicketOrderItem[];
  payment?: Payment;
}

// ── Notifications ──────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: 'submission_status' | 'ticket_order_status' | 'custom_announcement' | string;
  title: string;
  body: string;
  data: {
    submission_id?: string;    // UUID
    ticket_order_id?: string;  // UUID
    food_order_id?: string;    // UUID
  };
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  data: AppNotification[];
  meta: { unread_count: number };
}

// ── Documents (OCR vault) ──────────────────────────────────────────────────

export interface Document {
  id: string; // UUID
  type: import('./enums').DocumentType;
  subtype: string | null;
  file_url: string | null;
  extracted_data: Record<string, string | null>;
  expiry_date: string | null;    // YYYY-MM-DD
  extension_date: string | null; // YYYY-MM-DD — next report date for 90-day slips
  is_valid_type: boolean;
  validation_message: string | null;
  is_admin_created: boolean;
  created_at: string;
  updated_at: string;
}

// ── User addresses ─────────────────────────────────────────────────────────

export interface UserAddress {
  id: number;
  label: 'home' | 'work' | 'other';
  label_display: string;
  address: string;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

// ── Food ordering ──────────────────────────────────────────────────────────

export interface OpeningHour {
  day_of_week: number; // 0 = Sunday … 6 = Saturday
  opens_at: string | null;  // "HH:mm"
  closes_at: string | null; // "HH:mm"
  is_closed: boolean;
}

export interface RestaurantPhoto {
  id: number;
  url: string;
  sort_order: number;
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
  menu_category_id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  price_cents: number;
  original_price_cents: number | null;
  photo_url: string | null;
  status: import('./enums').MenuItemStatus;
  sort_order: number;
  option_groups: MenuItemOptionGroup[];
}

export interface MenuCategory {
  id: number;
  restaurant_id: number;
  name: string;
  sort_order: number;
  category_type: import('./enums').MenuCategoryType | null;
  is_system: boolean;
  items?: MenuItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  cover_photo_url: string | null;
  logo_url: string | null;
  status: import('./enums').RestaurantStatus;
  delivery_radius_km: number | null;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_cents: number;
  opening_hours?: OpeningHour[];
  photos?: RestaurantPhoto[];
  menu?: MenuCategory[];
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
  price_cents: number;
  additional_price_cents: number;
  quantity: number;
  notes: string | null;
  selected_options: FoodOrderSelectedOption[];
  subtotal_cents: number;
}

export interface FoodOrder {
  id: string; // UUID
  order_number: string | null;
  restaurant_id: number;
  restaurant_name: string | null;
  restaurant_logo_url: string | null;
  restaurant_phone: string | null;
  status: import('./enums').FoodOrderStatus;
  status_label: string;
  payment_method: import('./enums').FoodPaymentMethod;
  subtotal_cents: number;
  total_cents: number;
  delivery_address: string | null;
  customer_notes: string | null;
  prompt_pay_url: string | null;
  can_show_prompt_pay: boolean;
  items?: FoodOrderItem[];
  rating: number | null;
  customer_review: string | null;
  confirmed_at: string | null;
  payment_confirmed_at: string | null;
  preparing_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface OrderChatMessage {
  id: number;
  sender_type: 'customer' | 'admin';
  sender_id: number;
  sender_name: string;
  body: string | null;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
}

// ── Home Cards ─────────────────────────────────────────────────────────────

export interface HomeCard {
  id: number;
  parent_id: number | null;
  slug: string;
  position: number;
  title_en: string;
  title_mm: string;
  subtitle_en: string | null;
  subtitle_mm: string | null;
  tag_en: string;
  tag_mm: string;
  accent_color: string;
  icon_key: string;
  icon_type: import('./enums').HomeCardIconType;
  icon_url: string | null;
  navigation_screen: string | null;
  route_type: import('./enums').HomeCardRouteType;
  route_url: string | null;
  navigation_params: Record<string, unknown> | null;
  is_active: boolean;
  is_coming_soon: boolean;
  children?: HomeCard[];
}

// ── Emergency Contacts ─────────────────────────────────────────────────────

export interface EmergencyContactPhoto {
  id: number;
  url: string;
  is_cover: boolean;
  position: number;
}

export interface EmergencyContact {
  id: number;
  type: import('./enums').EmergencyContactType;
  title_en: string;
  title_mm: string;
  title_th: string | null;
  description_en: string | null;
  description_mm: string | null;
  description_th: string | null;
  phone: string | null;
  map_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  facebook_url: string | null;
  website_url: string | null;
  /** Present on list endpoint only (cover photo). */
  cover_photo?: string | null;
  /** Present on detail endpoint only. */
  photos?: EmergencyContactPhoto[];
}

// ── API wrappers ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  context?: Record<string, string>;
  status: number;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}
