import apiClient from './client';
import { FoodOrder, OrderChatMessage } from '@/types/models';
import { ApiResponse, PaginatedResponse } from '@/types/models';
import { FoodPaymentMethod } from '@/types/enums';

export interface PlaceFoodOrderInput {
  restaurant_id: number;
  payment_method: FoodPaymentMethod;
  idempotency_key: string;
  delivery_address_id: number | null;
  delivery_address: string | null;
  customer_notes: string | null;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    notes: string | null;
    selected_options: Array<{ option_group_id: number; option_id: number }>;
  }>;
}

export interface CompleteFoodOrderInput {
  rating?: number | null;
  review?: string | null;
}

export async function fetchActiveOrder(): Promise<FoodOrder[]> {
  const res = await apiClient.get<{ data: FoodOrder[] | FoodOrder | null }>('/api/v1/food-orders/active');
  const data = res.data.data;
  if (Array.isArray(data)) return data;      // new server format
  if (data == null) return [];               // no active order
  return [data];                             // old server format: single object
}

export async function fetchFoodOrders(page = 1): Promise<PaginatedResponse<FoodOrder>> {
  const res = await apiClient.get<PaginatedResponse<FoodOrder>>('/api/v1/food-orders', {
    params: { page },
  });
  return res.data;
}

export async function fetchFoodOrderDetail(id: string): Promise<FoodOrder> {
  const res = await apiClient.get<ApiResponse<FoodOrder>>(`/api/v1/food-orders/${id}`);
  return res.data.data;
}

export async function placeFoodOrder(input: PlaceFoodOrderInput): Promise<FoodOrder> {
  const res = await apiClient.post<ApiResponse<FoodOrder>>('/api/v1/food-orders', input);
  return res.data.data;
}

export async function completeFoodOrder(id: string, input: CompleteFoodOrderInput): Promise<FoodOrder> {
  const res = await apiClient.post<ApiResponse<FoodOrder>>(`/api/v1/food-orders/${id}/complete`, input);
  return res.data.data;
}

export async function cancelFoodOrder(id: string): Promise<FoodOrder> {
  const res = await apiClient.post<ApiResponse<FoodOrder>>(`/api/v1/food-orders/${id}/cancel`);
  return res.data.data;
}

export async function deleteFoodOrder(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/food-orders/${id}`);
}

export async function notifyLinePayment(id: string): Promise<void> {
  await apiClient.post(`/api/v1/food-orders/${id}/notify-line-pay`);
}

export async function fetchOrderChat(orderId: string): Promise<OrderChatMessage[]> {
  const res = await apiClient.get<{ data: OrderChatMessage[] }>(`/api/v1/food-orders/${orderId}/chat`);
  return res.data.data;
}

export async function sendOrderChatMessage(
  orderId: string,
  body: string | null,
  image: { uri: string; name: string; type: string } | null,
): Promise<OrderChatMessage> {
  const form = new FormData();
  if (body) form.append('body', body);
  if (image) {
    form.append('image', { uri: image.uri, name: image.name, type: image.type } as unknown as Blob);
  }
  const res = await apiClient.post<ApiResponse<OrderChatMessage>>(
    `/api/v1/food-orders/${orderId}/chat`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data.data;
}
