import type { FoodOrder, PaginatedResponse } from '../types/models';
import { apiClient } from './client';

export interface OrdersParams {
  status?:    string;
  date?:      string;   // single-day  YYYY-MM-DD
  date_from?: string;   // range start YYYY-MM-DD
  date_to?:   string;   // range end   YYYY-MM-DD
  page?:      number;
}

export async function getOrders(
  params?: OrdersParams,
): Promise<PaginatedResponse<FoodOrder>> {
  const response = await apiClient.get<PaginatedResponse<FoodOrder>>(
    '/orders',
    { params },
  );
  return response.data;
}

export async function getOrder(id: number): Promise<FoodOrder> {
  const response = await apiClient.get<{ data: FoodOrder }>(`/orders/${id}`);
  return response.data.data;
}

export async function updateOrderStatus(
  id: number,
  status: string,
): Promise<FoodOrder> {
  const response = await apiClient.patch<{ data: FoodOrder }>(
    `/orders/${id}/status`,
    { status },
  );
  return response.data.data;
}

export interface CancelOrderPayload {
  cancel_reason: string;
  cancel_description: string | null;
}

export async function cancelOrderWithReason(
  id: number,
  payload: CancelOrderPayload,
): Promise<FoodOrder> {
  const response = await apiClient.patch<{ data: FoodOrder }>(
    `/orders/${id}/status`,
    { status: 'cancelled', ...payload },
  );
  return response.data.data;
}


