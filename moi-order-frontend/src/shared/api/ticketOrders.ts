import apiClient from './client';
import { PaginatedResponse, ApiResponse, TicketOrder, Payment } from '@/types/models';

export interface CreateTicketOrderPayload {
  ticket_id: number;
  visit_date: string;
  idempotency_key: string;
  items: Array<{ ticket_variant_id: number; quantity: number }>;
}

export async function createTicketOrder(payload: CreateTicketOrderPayload): Promise<TicketOrder> {
  const { data } = await apiClient.post<ApiResponse<TicketOrder>>('/api/v1/ticket-orders', payload);
  return data.data;
}

export async function fetchTicketOrders(page = 1): Promise<PaginatedResponse<TicketOrder>> {
  const { data } = await apiClient.get('/api/v1/ticket-orders', { params: { page } });
  return data;
}

export async function fetchTicketOrder(id: number): Promise<TicketOrder> {
  const { data } = await apiClient.get<ApiResponse<TicketOrder>>(`/api/v1/ticket-orders/${id}`);
  return data.data;
}

export async function createTicketOrderPayment(ticketOrderId: number): Promise<Payment> {
  const { data } = await apiClient.post<ApiResponse<Payment>>(`/api/v1/ticket-orders/${ticketOrderId}/payment`);
  return data.data;
}

export async function fetchTicketOrderPayment(ticketOrderId: number): Promise<Payment> {
  const { data } = await apiClient.get<ApiResponse<Payment>>(`/api/v1/ticket-orders/${ticketOrderId}/payment`);
  return data.data;
}

export async function syncTicketOrderPaymentStatus(ticketOrderId: number): Promise<void> {
  await apiClient.post(`/api/v1/ticket-orders/${ticketOrderId}/payment/sync`);
}

export async function fetchTicketOrderEticketUrl(ticketOrderId: number): Promise<string> {
  const { data } = await apiClient.get<ApiResponse<{ url: string }>>(`/api/v1/ticket-orders/${ticketOrderId}/eticket`);
  return data.data.url;
}
