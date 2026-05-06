export const ERROR_CODES = {
  ORDER_NOT_CANCELLABLE:    'order.not_cancellable',
  SLOT_UNAVAILABLE:         'slot.unavailable',
  SERVICE_INACTIVE:         'service.inactive',
  ACCOUNT_SUSPENDED:        'account.suspended',
  ACCOUNT_BANNED:           'account.banned',
  EMAIL_NOT_VERIFIED:       'email.not_verified',
  EMAIL_ALREADY_REGISTERED: 'email.already_registered',
  OTP_RESEND_TOO_SOON:      'otp.resend_too_soon',
} as const;

export const DOMAIN_ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.ORDER_NOT_CANCELLABLE]:    'This order can no longer be cancelled.',
  [ERROR_CODES.SLOT_UNAVAILABLE]:         'The selected time slot is no longer available.',
  [ERROR_CODES.SERVICE_INACTIVE]:         'This service is currently unavailable.',
  [ERROR_CODES.ACCOUNT_SUSPENDED]:        'Your account has been suspended. Please contact support.',
  [ERROR_CODES.ACCOUNT_BANNED]:           'Your account has been banned. Please contact support.',
  [ERROR_CODES.EMAIL_NOT_VERIFIED]:       'Please verify your email before signing in.',
  [ERROR_CODES.EMAIL_ALREADY_REGISTERED]: 'This email is already registered. Please sign in instead.',
};

/**
 * Returns the user-facing message for an error code.
 * For timed suspensions, appends the expiry date from context.
 */
export function getAccountErrorMessage(code: string, context?: Record<string, string>): string {
  if (code === ERROR_CODES.ACCOUNT_SUSPENDED && context?.suspended_until != null) {
    const d = new Date(context.suspended_until);
    const formatted = d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return `Your account is suspended until ${formatted}. Please contact support.`;
  }
  return DOMAIN_ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.';
}
