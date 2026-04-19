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
  payable_type: string | null;
  payable_id: number | null;
  payable: { id: number; type: string } | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = {
  page?: number;
  per_page?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
};

export const paymentsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: PaymentData[]; meta: Meta }>('/payments', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: PaymentData }>(`/payments/${id}`).then((r) => r.data.data),
};
