// Query keys added here as features are built
export const QUERY_KEYS = {
  PLACES: {
    LIST:   ['places', 'list'] as const,
    DETAIL: (id: number) => ['places', 'detail', id] as const,
  },
  FAVORITES: {
    STATUS: (placeId: number) => ['favorites', 'status', placeId] as const,
  },
  SERVICES: {
    LIST: ['services', 'list'] as const,
  },
  SUBMISSIONS: {
    LIST:   ['submissions', 'list'] as const,
    DETAIL: (id: number) => ['submissions', 'detail', id] as const,
  },
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  PROFILE: {
    ME: ['auth', 'me'] as const, // same key — profile re-uses the ME query
  },
} as const;
