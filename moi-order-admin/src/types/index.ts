// ----------------------------------------------------------------------
// Places

export type Place = {
  id: number;
  name_my: string;
  name_en: string;
  name_th: string | null;
  short_description: string | null;
  long_description: string | null;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  contact_phone: string | null;
  website: string | null;
  google_map_url: string | null;
  cover_image: string | null;
  created_at: string;
  deleted_at: string | null;
  category: PlaceCategory | null;
  tags: PlaceTag[];
  images: PlaceImage[];
};

export type PlaceImage = {
  id: number;
  place_id: number;
  path: string;
  sort_order: number;
  created_at: string;
};

// ----------------------------------------------------------------------
// Categories

export type PlaceCategory = {
  id: number;
  name_my: string;
  name_en: string;
  name_th: string | null;
  slug: string;
  places_count?: number;
  created_at: string;
  deleted_at: string | null;
};

// ----------------------------------------------------------------------
// Tags

export type PlaceTag = {
  id: number;
  name_my: string;
  name_en: string;
  name_th: string | null;
  slug: string;
  places_count?: number;
  created_at: string;
  deleted_at: string | null;
};

// ----------------------------------------------------------------------
// Attractions (Tickets in backend)

export type TicketVariant = {
  id: number;
  ticket_id: number;
  name: string;
  description: string | null;
  /** Satangs — divide by 100 for display */
  price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Ticket = {
  id: number;
  name: string;
  highlight_description: string;
  description: string;
  google_maps_link: string;
  address: string;
  city: string;
  province: string;
  cover_image_path: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  deleted_at: string | null;
  variants?: TicketVariant[];
};

// ----------------------------------------------------------------------
// Bookings (Ticket Orders in backend)

export type TicketOrderStatus = 'pending_payment' | 'processing' | 'completed' | 'payment_failed';

export type TicketOrderItem = {
  id: number;
  ticket_order_id: number;
  variant: TicketVariant;
  quantity: number;
  /** Satangs — divide by 100 for display */
  unit_price: number;
};

export type TicketOrder = {
  id: number;
  user_id: number;
  ticket_id: number;
  visit_date: string;
  status: TicketOrderStatus;
  eticket_path: string | null;
  completed_at: string | null;
  created_at: string;
  ticket?: Ticket;
  items?: TicketOrderItem[];
  user?: AppUser;
  payment?: Payment;
};

// ----------------------------------------------------------------------
// Users

export type AppUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  date_of_birth: string | null;
  email_verified_at: string | null;
  created_at: string;
  deleted_at: string | null;
};

// ----------------------------------------------------------------------
// Payments

export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export type Payment = {
  id: number;
  status: PaymentStatus;
  status_label: string;
  /** Satangs — divide by 100 for display */
  amount: number;
  currency: string;
  stripe_intent_id: string | null;
  qr_image_url: string | null;
  expires_at: string | null;
  created_at: string;
  payable_type: string;
  payable_id: number;
  payable?: { id: number; type: string };
};

// ----------------------------------------------------------------------
// Services & Form Builder

/** Matches backend FieldType enum */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'boolean'
  | 'select'
  | 'file';

export type ServiceField = {
  key: string;
  label: string;
  label_en: string;
  type: FieldType;
  required: boolean;
  sort_order: number;
  options: string[] | null;
  /** Only for type=file: ['image','pdf','doc'] */
  accepts: string[] | null;
};

export type ServiceType = {
  id: number;
  service_id: number;
  name: string;
  name_en: string;
  name_mm: string | null;
  /** Satangs — divide by 100 for display */
  price: number;
  is_active: boolean;
  field_schema: ServiceField[];
  created_at: string;
  deleted_at: string | null;
};

export type Service = {
  id: number;
  name: string;
  name_en: string;
  name_mm: string | null;
  slug: string;
  is_active: boolean;
  types_count?: number;
  created_at: string;
  deleted_at: string | null;
  types?: ServiceType[];
};

// ----------------------------------------------------------------------
// Service Submissions

/** Matches backend SubmissionStatus enum */
export type SubmissionStatus = 'pending_payment' | 'processing' | 'completed' | 'payment_failed';

export type SubmissionDocument = {
  id: number;
  name: string;
  url: string;
  /** Derived from file extension for UI display */
  type: 'image' | 'document';
  size: string;
};

export type ServiceSubmission = {
  id: number;
  status: SubmissionStatus;
  status_label: string;
  /** Satangs — divide by 100 for display */
  price_snapshot: number;
  completed_at: string | null;
  created_at: string;
  user: AppUser;
  service_type: ServiceType & { service?: Service };
  documents: SubmissionDocument[];
  payment: Payment | null;
  /** Dynamic form answers; file fields contain signed URLs */
  submission_data: Record<string, string>;
};

// ----------------------------------------------------------------------
// Admin Notifications

export type AdminNotificationType = 'new_submission' | 'new_ticket_order' | 'new_payment';

export type AdminNotificationData = {
  notification_type: AdminNotificationType;
  title: string;
  body: string;
  submission_id?: string;
  ticket_order_id?: string;
};

export type AdminNotification = {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  data: AdminNotificationData;
  is_read: boolean;
  created_at: string;
  time_ago: string;
};

// ----------------------------------------------------------------------
// Content (Ads & Notifications) — no backend API yet; kept for UI

export type ContentType = 'advertisement' | 'notification' | 'banner' | 'announcement';
export type ContentStatus = 'active' | 'inactive' | 'draft';

export type ContentItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  type: ContentType;
  status: ContentStatus;
  createdAt: string;
};

// ----------------------------------------------------------------------
// Chat Attachments — no backend API yet; kept for UI

export type ChatAttachment = {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'file' | 'audio';
  size?: string;
  duration?: number;
};

// ----------------------------------------------------------------------
// Support — no backend API yet; kept for UI

export type SupportStatus = 'open' | 'pending' | 'closed';

export type SupportMessage = {
  id: number;
  author: string;
  avatarUrl: string;
  isAdmin: boolean;
  text: string;
  attachments?: ChatAttachment[];
  createdAt: string;
};

export type SupportTicket = {
  id: number;
  userName: string;
  userEmail: string;
  userAvatar: string;
  subject: string;
  status: SupportStatus;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
};

// ----------------------------------------------------------------------
// Roles & Permissions — no backend API yet; kept for UI

export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'viewer';

export type AdminAccount = {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
};
