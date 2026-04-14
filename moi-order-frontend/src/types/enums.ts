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

// Mirrors App\Enums\DocumentType
export const DOCUMENT_TYPE = {
  PassportBioPage:   'passport_bio_page',
  VisaPage:          'visa_page',
  OldSlip:           'old_slip',
  IdentityCardFront: 'identity_card_front',
  IdentityCardBack:  'identity_card_back',
  Tm30:              'tm30',
  UpperBodyPhoto:    'upper_body_photo',
  AirplaneTicket:    'airplane_ticket',
  PassportSizePhoto: 'passport_size_photo',
  TestPhoto:         'test_photo',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];
