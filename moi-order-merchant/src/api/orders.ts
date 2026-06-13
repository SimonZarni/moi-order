import type { FoodOrder, PaginatedResponse } from '../types/models';
import { apiClient } from './client';

export interface OrdersParams {
  status?:    string;
  date?:      string;   // single-day  YYYY-MM-DD
  date_from?: string;   // range start YYYY-MM-DD
  date_to?:   string;   // range end   YYYY-MM-DD
  page?:      number;
  per_page?:  number;
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

export async function getOrder(id: string): Promise<FoodOrder> {
  const response = await apiClient.get<{ data: FoodOrder }>(`/orders/${id}`);
  return response.data.data;
}

export async function updateOrderStatus(
  id: string,
  status: string,
  preparationTimeMinutes?: number,
): Promise<FoodOrder> {
  const response = await apiClient.patch<{ data: FoodOrder }>(
    `/orders/${id}/status`,
    {
      status,
      ...(preparationTimeMinutes !== undefined ? { preparation_time_minutes: preparationTimeMinutes } : {}),
    },
  );
  return response.data.data;
}

export interface CancelOrderPayload {
  cancel_reason: string;
  cancel_description: string | null;
}

export async function cancelOrderWithReason(
  id: string,
  payload: CancelOrderPayload,
): Promise<FoodOrder> {
  const response = await apiClient.patch<{ data: FoodOrder }>(
    `/orders/${id}/status`,
    { status: 'cancelled', ...payload },
  );
  return response.data.data;
}


