export const QUERY_KEYS = {
  ME: ['me'] as const,
  KYC_APPLICATION: ['kyc', 'application'] as const,
  ORDERS: (date?: string) => ['orders', date ?? null] as const,
  ORDER_DETAIL: (id: number) => ['orders', id] as const,
  MENU_CATEGORIES: ['menu', 'categories'] as const,
  RESTAURANT: ['restaurant'] as const,
  ANALYTICS: ['analytics'] as const,
  ORDER_CHAT: (orderId: number) => ['orders', orderId, 'chat'] as const,
} as const;
