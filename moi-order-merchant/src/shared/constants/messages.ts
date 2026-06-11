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
  'menu.system_category_empty': 'Add at least 1 item to Popular Picks and Recommendations before opening your restaurant.',
  'menu.category_has_items': 'This category has menu items. Remove or move all items before deleting it.',
  'restaurant.gallery_limit_reached': 'You can upload up to 8 gallery photos.',
  'merchant.access_required': 'This account is not registered as a merchant. Please sign in with your merchant account or contact support.',
  'account.suspended': 'Your account has been suspended. Please contact support.',
};
