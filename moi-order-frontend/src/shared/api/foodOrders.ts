import apiClient from './client';
import { FoodOrder } from '@/types/models';
import { ApiResponse, PaginatedResponse } from '@/types/models';
import { FoodPaymentMethod } from '@/types/enums';

export interface PlaceFoodOrderInput {
  restaurant_id: number;
  payment_method: FoodPaymentMethod;
  idempotency_key: string;
  delivery_address: string | null;
  customer_notes: string | null;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    notes: string | null;
  }>;
}

export async function fetchFoodOrders(page = 1): Promise<PaginatedResponse<FoodOrder>> {
  const res = await apiClient.get<PaginatedResponse<FoodOrder>>('/v1/food-orders', {
    params: { page },
  });
  return res.data;
}

export async function fetchFoodOrderDetail(id: number): Promise<FoodOrder> {
  const res = await apiClient.get<ApiResponse<FoodOrder>>(`/v1/food-orders/${id}`);
  return res.data.data;
}

export async function placeFoodOrder(input: PlaceFoodOrderInput): Promise<FoodOrder> {
  const res = await apiClient.post<ApiResponse<FoodOrder>>('/v1/food-orders', input);
  return res.data.data;
}
