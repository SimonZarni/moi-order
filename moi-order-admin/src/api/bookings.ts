import apiClient from './client';

export type BookingStatus = 'pending_payment' | 'processing' | 'completed' | 'payment_failed';

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

export type BookingItemData = {
  id: number;
  quantity: number;
  price_snapshot: number;
  subtotal: number;
  variant: { id: number; name: string } | null;
};

export type BookingPaymentData = {
  id: number;
  status: string;
  status_label: string;
  amount: number;
  currency: string;
  qr_image_url: string | null;
  expires_at: string | null;
};

export type BookingUserData = {
  id: number;
  name: string;
  email: string;
};

export type BookingDetailData = BookingData & {
  items: BookingItemData[];
  payment: BookingPaymentData | null;
  user: BookingUserData | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; status?: string; search?: string };

export const bookingsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: BookingData[]; meta: Meta }>('/ticket-orders', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient
      .get<{ data: BookingDetailData }>(`/ticket-orders/${id}`)
      .then((r) => r.data.data),
  uploadEticket: (id: number | string, file: File) => {
    const formData = new FormData();
    formData.append('eticket', file);
    return apiClient
      .post<{ data: BookingDetailData }>(`/ticket-orders/${id}/eticket`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data);
  },
  downloadEticket: (id: number | string) =>
    apiClient
      .get(`/ticket-orders/${id}/eticket`, { responseType: 'blob' })
      .then((r) => ({ blob: r.data as Blob, contentType: r.headers['content-type'] as string })),
};
