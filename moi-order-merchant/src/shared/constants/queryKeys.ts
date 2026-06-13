import type { AnalyticsPeriod } from '../../types/models';

export const QUERY_KEYS = {
  ME: ['me'] as const,
  KYC_APPLICATION: ['kyc', 'application'] as const,
  ORDERS: (date?: string) => ['orders', date ?? null] as const,
  ORDER_DETAIL: (id: string) => ['orders', id] as const,
  MENU_CATEGORIES: ['menu', 'categories'] as const,
  RESTAURANT: ['restaurant'] as const,
  ANALYTICS: ['analytics'] as const,
  TOP_DATA: (period: string) => ['analytics', 'tops', period] as const,
  ANALYTICS_CHART: (period: Exclude<AnalyticsPeriod, 'all'>) =>
    ['analytics', 'chart', period] as const,
  ORDER_CHAT: (orderId: string) => ['orders', orderId, 'chat'] as const,
  BUSINESS_PROFILE: ['business-profile'] as const,
  NOTIFICATIONS: {
    LIST: ['notifications'] as const,
    UNREAD_COUNT: ['notifications', 'unread-count'] as const,
  },
  REVIEWS: (page?: number, rating?: number) => ['reviews', page ?? 1, rating ?? null] as const,
} as const;
