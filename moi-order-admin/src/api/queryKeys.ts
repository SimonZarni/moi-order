// Centralized TanStack Query key factory.
// All cache entries are keyed from here so views and hooks always share the same cache.

type UsersListParams     = { page: number; per_page: number; search?: string };
type PaymentsListParams  = { page: number; per_page: number; status?: string; search?: string };
type AuditLogsListParams = {
  page: number;
  per_page: number;
  admin_id?: number;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

export const QUERY_KEYS = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  users: {
    list: (p: UsersListParams) => ['users', 'list', p] as const,
  },
  payments: {
    stats:    ['payments', 'stats']    as const,
    settings: ['payments', 'settings'] as const,
    list: (p: PaymentsListParams) => ['payments', 'list', p] as const,
  },
  auditLogs: {
    list: (p: AuditLogsListParams) => ['audit-logs', 'list', p] as const,
  },
} as const;
