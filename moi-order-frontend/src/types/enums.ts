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

