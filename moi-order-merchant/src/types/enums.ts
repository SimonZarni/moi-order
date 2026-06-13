export const KYC_STATUS = {
  Draft: 'draft',
  Submitted: 'submitted',
  UnderReview: 'under_review',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;
export type KycStatus = (typeof KYC_STATUS)[keyof typeof KYC_STATUS];

export const KYC_DOC_TYPE = {
  NationalId: 'national_id',
  BusinessRegistration: 'business_registration',
  BankBook: 'bank_book',
  StorefrontPhoto: 'storefront_photo',
} as const;
export type KycDocType = (typeof KYC_DOC_TYPE)[keyof typeof KYC_DOC_TYPE];

export const ORDER_STATUS = {
  OrderPlaced: 'order_placed',
  WaitingForPayment: 'waiting_for_payment',
  PaymentConfirmed: 'payment_confirmed',
  PreparingFood: 'preparing_food',
  WaitingForDelivery: 'waiting_for_delivery',
  DeliveryOnTheWay: 'delivery_on_the_way',
  Delivered: 'delivered',
  Completed: 'completed',
  Cancelled: 'cancelled',
  Expired:   'expired',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const MENU_ITEM_STATUS = {
  Available: 'available',
  OutOfStock: 'out_of_stock',
  Hidden: 'hidden',
} as const;
export type MenuItemStatus =
  (typeof MENU_ITEM_STATUS)[keyof typeof MENU_ITEM_STATUS];

export const RESTAURANT_STATUS = {
  Open: 'open',
  Closed: 'closed',
  Paused: 'paused',
} as const;
export type RestaurantStatus = (typeof RESTAURANT_STATUS)[keyof typeof RESTAURANT_STATUS];
