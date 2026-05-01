import apiClient from './client';

import type { FoodOrder, FoodOrderStatus, PaginatedResponse, ApiResponse } from 'src/types';

// ----------------------------------------------------------------------

interface FetchOrdersParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export async function fetchOrders(params?: FetchOrdersParams): Promise<PaginatedResponse<FoodOrder>> {
  const res = await apiClient.get<PaginatedResponse<FoodOrder>>('/orders', { params });
  return res.data;
}

export async function updateOrderStatus(id: number, status: FoodOrderStatus): Promise<FoodOrder> {
  const res = await apiClient.put<ApiResponse<FoodOrder>>(`/orders/${id}/status`, { status });
  return res.data.data;
}
