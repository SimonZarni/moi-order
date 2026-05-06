// Query keys added here as features are built
export const QUERY_KEYS = {
  PLACES: {
    LIST:     ['places', 'list'] as const,
    ALL:      () => ['places', 'all'] as const,
    DETAIL:   (id: number) => ['places', 'detail', id] as const,
    FAVORITE: (id: number) => ['places', 'favorite', id] as const,
  },
  FAVORITES: {
    STATUS: (placeId: number) => ['favorites', 'status', placeId] as const,
    IDS:    ['favorites', 'ids'] as const,
  },
  SERVICES: {
    LIST: ['services', 'list'] as const,
  },
  SERVICE_CATEGORIES: {
    BY_SLUG: (slug: string) => ['service-categories', slug] as const,
  },
  SUBMISSIONS: {
    LIST:   ['submissions', 'list'] as const,
    DETAIL: (id: number) => ['submissions', 'detail', id] as const,
  },
  PAYMENTS: {
    FOR_SUBMISSION: (submissionId: number) => ['payments', 'submission', submissionId] as const,
  },
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  PROFILE: {
    ME: ['auth', 'me'] as const,
  },
  TICKETS: {
    LIST:   ['tickets', 'list'] as const,
    DETAIL: (id: number) => ['tickets', 'detail', id] as const,
  },
  TICKET_ORDERS: {
    LIST:   ['ticket-orders', 'list'] as const,
    DETAIL: (id: number) => ['ticket-orders', 'detail', id] as const,
  },
  NOTIFICATIONS: {
    LIST: ['notifications', 'list'] as const,
  },
  TAGS: {
    LIST: () => ['tags', 'list'] as const,
  },
  DOCUMENTS: {
    LIST:         (type: string) => ['documents', 'list', type] as const,
    UPLOAD_STATS: ['documents', 'upload-stats'] as const,
  },
  RESTAURANTS: {
    LIST:   (search?: string) => ['restaurants', 'list', search ?? ''] as const,
    DETAIL: (id: number)      => ['restaurants', 'detail', id] as const,
  },
  FOOD_ORDERS: {
    LIST:   ['food-orders', 'list'] as const,
    DETAIL: (id: number) => ['food-orders', 'detail', id] as const,
    CHAT:   (id: number) => ['food-orders', 'chat', id] as const,
  },
  HOME_CARDS: {
    LIST: ['home-cards', 'list'] as const,
  },
  VERIFICATION: {
    STATUS: ['verification', 'status'] as const,
  },
  EMERGENCY_CONTACTS: {
    LIST:   (type: string) => ['emergency-contacts', 'list', type] as const,
    DETAIL: (id: number)   => ['emergency-contacts', 'detail', id] as const,
  },
} as const;
