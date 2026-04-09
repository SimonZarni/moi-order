// Query keys added here as features are built
export const QUERY_KEYS = {
  PLACES: {
    LIST:   ['places', 'list'] as const,
    DETAIL: (id: number) => ['places', 'detail', id] as const,
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
} as const;
