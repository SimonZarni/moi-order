export const QUERY_KEYS = {
  ME: ['me'] as const,
  KYC_APPLICATION: ['kyc', 'application'] as const,
  ORDERS: (params?: { status?: string; page?: number }) =>
    ['orders', params] as const,
  MENU_CATEGORIES: ['menu', 'categories'] as const,
  RESTAURANT: ['restaurant'] as const,
} as const;
