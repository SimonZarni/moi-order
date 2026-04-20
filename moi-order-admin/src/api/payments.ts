import apiClient from './client';

export type PaymentData = {
  id: number;
  status: string;
  status_label: string;
  amount: number;
  currency: string;
  stripe_intent_id: string | null;
  qr_image_url: string | null;
  expires_at: string | null;
  created_at: string;
  user_name: string | null;
  payable_type: string | null;
  payable_id: number | null;
  payable: { id: number; type: string } | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
};

export type PaymentStats = {
  total_revenue: number;
  succeeded_count: number;
  pending_count: number;
  failed_count: number;
};

export const paymentsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: PaymentData[]; meta: Meta }>('/payments', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: PaymentData }>(`/payments/${id}`).then((r) => r.data.data),
  stats: () =>
    apiClient.get<{ data: PaymentStats }>('/payments/stats').then((r) => r.data.data),
  confirm: (id: number | string) =>
    apiClient.post<{ data: PaymentData }>(`/payments/${id}/confirm`).then((r) => r.data.data),
};
