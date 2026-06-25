import apiClient from './client';

export type InvoiceStatus = 'pending' | 'paid';

export type InvoiceRestaurant = {
  id: number;
  name: string;
  payment_qr_url: string | null;
  has_payment_qr: boolean;
};

export type DailyInvoice = {
  id: number | null;
  date: string;
  order_count: number;
  customer_total_cents: number;
  platform_fee_cents: number;
  payout_cents: number;
  status: InvoiceStatus;
  status_label: string;
  is_provisional: boolean;
  paid_at: string | null;
  confirmed_by_id: number | null;
  created_at: string | null;
  restaurant?: InvoiceRestaurant;
};

export type InvoicePeriodSummary = {
  period: 'week' | 'month';
  date_from: string;
  date_to: string;
  order_count: number;
  customer_total_cents: number;
  platform_fee_cents: number;
  payout_cents: number;
};

export type InvoiceMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  restaurant_count: number;
  total_orders: number;
  total_customer_cents: number;
  total_platform_fee_cents: number;
  total_payout_cents: number;
};

export type InvoicesResponse = {
  data: DailyInvoice[];
  meta: InvoiceMeta;
};

export const invoicesApi = {
  list: async (date: string, page = 1, perPage = 20): Promise<InvoicesResponse> => {
    const res = await apiClient.get<InvoicesResponse>('/daily-invoices', {
      params: { date, page, per_page: perPage },
    });
    return res.data;
  },

  confirm: async (id: number): Promise<void> => {
    await apiClient.post(`/daily-invoices/${id}/confirm`);
  },

  generate: async (date: string): Promise<void> => {
    await apiClient.post('/daily-invoices/generate', { date });
  },

  summary: async (period: 'week' | 'month'): Promise<InvoicePeriodSummary> => {
    const res = await apiClient.get<{ data: InvoicePeriodSummary }>('/daily-invoices/summary', {
      params: { period },
    });
    return res.data.data;
  },
};
