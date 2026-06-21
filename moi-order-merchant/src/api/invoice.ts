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

export async function uploadPaymentQr(file: { uri: string; type: string; name: string }): Promise<{ payment_qr_url: string }> {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData.append('qr_code', file as any);
  const response = await apiClient.post<{ message: string; payment_qr_url: string }>(
    '/restaurant/payment-qr',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return { payment_qr_url: response.data.payment_qr_url };
}
