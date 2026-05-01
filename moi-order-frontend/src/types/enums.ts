export const ORDER_STATUS = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  InProgress: 'in_progress',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Mirrors App\Enums\SubmissionStatus
export const SUBMISSION_STATUS = {
  PendingPayment: 'pending_payment',
  Processing:     'processing',
  Completed:      'completed',
  PaymentFailed:  'payment_failed',
} as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

// Mirrors App\Enums\PaymentStatus
export const PAYMENT_STATUS = {
  Pending:   'pending',
  Succeeded: 'succeeded',
  Failed:    'failed',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Mirrors App\Enums\TicketOrderStatus
export const TICKET_ORDER_STATUS = {
  PendingPayment: 'pending_payment',
  Processing:     'processing',
  Completed:      'completed',
  PaymentFailed:  'payment_failed',
} as const;

export type TicketOrderStatus = (typeof TICKET_ORDER_STATUS)[keyof typeof TICKET_ORDER_STATUS];

// Mirrors App\Enums\PlaceImportBatchStatus
export const PLACE_IMPORT_BATCH_STATUS = {
  Pending:    'pending',
  Processing: 'processing',
  Completed:  'completed',
  Failed:     'failed',
} as const;

export type PlaceImportBatchStatus = (typeof PLACE_IMPORT_BATCH_STATUS)[keyof typeof PLACE_IMPORT_BATCH_STATUS];

// Mirrors App\Enums\DocumentType
export const DOCUMENT_TYPE = {
  Passport:        'passport',
  NinetyDayReport: 'ninety_day_report',
  Other:           'other',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

// Mirrors App\Enums\FoodOrderStatus
export const FOOD_ORDER_STATUS = {
  OrderPlaced:          'order_placed',
  WaitingForPayment:    'waiting_for_payment',
  PaymentConfirmed:     'payment_confirmed',
  PreparingFood:        'preparing_food',
  WaitingForDelivery:   'waiting_for_delivery',
  DeliveryOnTheWay:     'delivery_on_the_way',
  Delivered:            'delivered',
  Completed:            'completed',
  Cancelled:            'cancelled',
} as const;

export type FoodOrderStatus = (typeof FOOD_ORDER_STATUS)[keyof typeof FOOD_ORDER_STATUS];

// Mirrors App\Enums\FoodPaymentMethod
export const FOOD_PAYMENT_METHOD = {
  Cod:       'cod',
  PromptPay: 'prompt_pay',
} as const;

export type FoodPaymentMethod = (typeof FOOD_PAYMENT_METHOD)[keyof typeof FOOD_PAYMENT_METHOD];

// Mirrors App\Enums\MenuItemStatus
export const MENU_ITEM_STATUS = {
  Available:   'available',
  Unavailable: 'unavailable',
} as const;

export type MenuItemStatus = (typeof MENU_ITEM_STATUS)[keyof typeof MENU_ITEM_STATUS];

// Mirrors App\Enums\RestaurantStatus
export const RESTAURANT_STATUS = {
  Open:   'open',
  Closed: 'closed',
  Paused: 'paused',
} as const;

export type RestaurantStatus = (typeof RESTAURANT_STATUS)[keyof typeof RESTAURANT_STATUS];

// Builtin icon keys — kept as reference constants for the SVG component map
export const HOME_CARD_ICON_KEY = {
  Calendar: 'calendar',
  Location: 'location',
  Flash:    'flash',
  Embassy:  'embassy',
  Airport:  'airport',
  Bus:      'bus',
  Passport: 'passport',
  Food:     'food',
  Ticket:   'ticket',
} as const;

// Builtin nav screen keys — kept for the switch-case in homeCardNavigation.ts
export const HOME_CARD_NAV_SCREEN = {
  NinetyDayReport:  'NinetyDayReport',
  Places:           'Places',
  Tickets:          'Tickets',
  OtherServices:    'OtherServices',
  EmbassyServices:  'EmbassyServices',
  AirportFastTrack: 'AirportFastTrack',
  Food:             'Food',
  PassportVault:    'PassportVault',
  Search:           'Search',
  PlacesMap:        'PlacesMap',
} as const;

// Mirrors App\Enums\HomeCardIconType
export const HOME_CARD_ICON_TYPE = {
  Builtin: 'builtin',
  Custom:  'custom',
} as const;

export type HomeCardIconType = (typeof HOME_CARD_ICON_TYPE)[keyof typeof HOME_CARD_ICON_TYPE];

// Mirrors App\Enums\HomeCardRouteType
export const HOME_CARD_ROUTE_TYPE = {
  Internal:    'internal',
  ExternalUrl: 'external_url',
} as const;

export type HomeCardRouteType = (typeof HOME_CARD_ROUTE_TYPE)[keyof typeof HOME_CARD_ROUTE_TYPE];

// Mirrors App\Enums\FieldType
export const FIELD_TYPE = {
  Text:     'text',
  Textarea: 'textarea',
  Number:   'number',
  Email:    'email',
  Phone:    'phone',
  Date:     'date',
  Boolean:  'boolean',
  Select:   'select',
  File:     'file',
} as const;

export type FieldType = (typeof FIELD_TYPE)[keyof typeof FIELD_TYPE];

