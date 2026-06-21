import type { DailyInvoice, PaginatedResponse } from '../types/models';
import { apiClient } from './client';

export async function getTodayInvoice(): Promise<DailyInvoice> {
  const response = await apiClient.get<{ data: DailyInvoice }>('/invoices/today');
  return response.data.data;
}

export async function getInvoices(page = 1, perPage = 20): Promise<PaginatedResponse<DailyInvoice>> {
  const response = await apiClient.get<PaginatedResponse<DailyInvoice>>('/invoices', {
    params: { page, per_page: perPage },
  });
  return response.data;
}

export async function uploadPaymentQr(formData: FormData): Promise<{ payment_qr_url: string }> {
  const response = await apiClient.post<{ message: string; payment_qr_url: string }>(
    '/restaurant/payment-qr',
    formData,
  );
  return { payment_qr_url: response.data.payment_qr_url };
}
