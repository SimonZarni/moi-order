import apiClient from './client';

export type AuditLogAdmin = {
  id: number | null;
  name: string;
  email: string;
};

export type AuditLogData = {
  id: number;
  admin: AuditLogAdmin;
  action: string;
  action_label: string;
  entity_type: string | null;
  entity_id: string | null;
  entity_label: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = {
  page?: number;
  per_page?: number;
  admin_id?: number;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

type ExportParams = Omit<ListParams, 'page' | 'per_page'>;

export const auditLogsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: AuditLogData[]; meta: Meta }>('/audit-logs', { params })
      .then((r) => r.data),

  export: (params: ExportParams) =>
    apiClient
      .get<Blob>('/audit-logs/export', { params, responseType: 'blob' })
      .then((r) => r.data),
};
