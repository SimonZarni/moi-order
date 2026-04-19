import apiClient from './client';

export type BookingStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export type BookingData = {
  id: number;
  status: string;
  status_label: string;
  visit_date: string;
  total: number | null;
  completed_at: string | null;
  created_at: string;
  has_eticket: boolean;
  ticket: { id: number; name: string } | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; status?: string };

export const bookingsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: BookingData[]; meta: Meta }>('/ticket-orders', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: BookingData }>(`/ticket-orders/${id}`).then((r) => r.data.data),
};
