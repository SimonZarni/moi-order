export const MESSAGES = {
  genericError: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
  sessionExpired: 'Your session has expired. Please log in again.',
  unauthorized: 'You are not authorised to perform this action.',
} as const;

export const DOMAIN_MESSAGES: Record<string, string> = {
  'order.not_cancellable': 'This order can no longer be cancelled.',
  'kyc.already_submitted': 'Your KYC application has already been submitted.',
  'kyc.not_found': 'No KYC application found. Please start a new one.',
};
