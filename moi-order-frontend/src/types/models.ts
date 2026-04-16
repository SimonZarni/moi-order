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
  category: Category;
  /** Only present on the detail endpoint (/places/:id). */
  tags?: Tag[];
  /** Only present on the detail endpoint (/places/:id). List uses cover_image instead. */
  images?: PlaceImage[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  date_of_birth: string | null;  // ISO date "YYYY-MM-DD"
  email_verified_at: string | null;
  created_at: string;
}

// ── Services ───────────────────────────────────────────────────────────────

export interface ServiceType {
  id: number;
  name: string;
  name_en: string;
  price: number; // satangs
  // Present only when the parent service relation is loaded (detail endpoint)
  service?: {
    id: number;
    name: string;
    name_en: string;
  };
}

export interface Service {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  types: ServiceType[];
}

// ── Submissions ────────────────────────────────────────────────────────────

export interface SubmissionDetail {
  full_name: string;
  phone: string;
}

export interface SubmissionDocument {
  id: number;
  document_type: string;
  label: string;
  signed_url: string;
}

export interface EmbassyBankDetail extends SubmissionDetail {
  passport_no: string;
  identity_card_no: string;
  current_job: string | null;
  company: string | null;
  myanmar_address: string;
  thai_address: string;
  bank_name: string;
}

export interface Payment {
  id: number;
  status: string;
  status_label: string;
  amount: number;      // satangs
  currency: string;
  qr_image_url: string | null;
  expires_at: string | null;
}

export interface ServiceSubmission {
  id: number;
  status: string;
  status_label: string;
  price_snapshot: number; // satangs
  completed_at: string | null;
  created_at: string;
  service_type: ServiceType;
  detail?: SubmissionDetail;
  documents?: SubmissionDocument[];
  payment?: Payment;
}

// ── Tickets ────────────────────────────────────────────────────────────────

export interface TicketVariant {
  id: number;
  name: string;
  description: string | null;
  price: number; // whole THB
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
  id: number;
  status: string;
  status_label: string;
  visit_date: string; // "YYYY-MM-DD"
  total?: number;     // whole THB — present when items are loaded
  completed_at: string | null;
  created_at: string;
  has_eticket: boolean;
  ticket?: {
    id: number;
    name: string;
  };
  items?: TicketOrderItem[];
  payment?: Payment;
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
  status: number;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}
