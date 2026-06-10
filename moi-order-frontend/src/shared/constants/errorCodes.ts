export const ERROR_CODES = {
  ORDER_NOT_CANCELLABLE:         'order.not_cancellable',
  SLOT_UNAVAILABLE:              'slot.unavailable',
  SERVICE_INACTIVE:              'service.inactive',
  ACCOUNT_SUSPENDED:             'account.suspended',
  ACCOUNT_BANNED:                'account.banned',
  ACCOUNT_EMAIL_EXISTS:          'account.email_exists',
  ACCOUNT_NO_PASSWORD:           'account.no_password',
  ACCOUNT_MINIMUM_LOGIN_METHOD:  'account.minimum_login_method',
  EMAIL_NOT_VERIFIED:            'email.not_verified',
  EMAIL_ALREADY_REGISTERED:      'email.already_registered',
  OTP_RESEND_TOO_SOON:           'otp.resend_too_soon',
  MERCHANT_ALREADY_MERCHANT:     'merchant.already_merchant',
  KYC_APPLICATION_NOT_FOUND:     'kyc.application_not_found',
  KYC_CANNOT_CANCEL:             'kyc.cannot_cancel',
  ORDER_ADDRESS_REQUIRED:        'order.address_required',
  MENU_SYSTEM_CATEGORY_EMPTY:    'menu.system_category_empty',
  LINE_NOT_LINKED:               'order.line_not_linked',
  LINE_NOT_FOLLOWING:            'order.line_not_following',
} as const;

export const DOMAIN_ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.ORDER_NOT_CANCELLABLE]:    'This order can no longer be cancelled.',
  [ERROR_CODES.SLOT_UNAVAILABLE]:         'The selected time slot is no longer available.',
  [ERROR_CODES.SERVICE_INACTIVE]:         'This service is currently unavailable.',
  [ERROR_CODES.ACCOUNT_SUSPENDED]:        'Your account has been suspended. Please contact support.',
  [ERROR_CODES.ACCOUNT_BANNED]:           'Your account has been banned. Please contact support.',
  [ERROR_CODES.ACCOUNT_EMAIL_EXISTS]:         'An account with this email already exists. Sign in with email or password.',
  [ERROR_CODES.ACCOUNT_NO_PASSWORD]:          'This account uses social sign-in. Use Forgot Password to set a password for email sign-in.',
  [ERROR_CODES.ACCOUNT_MINIMUM_LOGIN_METHOD]: 'Cannot remove this account. You need at least one sign-in method.',
  [ERROR_CODES.EMAIL_NOT_VERIFIED]:           'Please verify your email before signing in.',
  [ERROR_CODES.EMAIL_ALREADY_REGISTERED]:     'This email is already registered. Please sign in instead.',
  [ERROR_CODES.MERCHANT_ALREADY_MERCHANT]:    'You are already a merchant.',
  [ERROR_CODES.KYC_APPLICATION_NOT_FOUND]:    'No application found to cancel.',
  [ERROR_CODES.KYC_CANNOT_CANCEL]:            'This application can no longer be cancelled.',
  [ERROR_CODES.ORDER_ADDRESS_REQUIRED]:       'Please add a delivery address before placing your order.',
  [ERROR_CODES.MENU_SYSTEM_CATEGORY_EMPTY]:   'Please add at least one item to Popular Picks and Recommendations before opening your restaurant.',
  [ERROR_CODES.LINE_NOT_LINKED]:              'Please sign in with LINE to use LINE Pay.',
  [ERROR_CODES.LINE_NOT_FOLLOWING]:           'Please follow Moi Order on LINE to receive your order confirmation.',
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
