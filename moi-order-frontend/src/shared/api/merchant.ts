import apiClient from '@/shared/api/client';
import { ApiResponse, KycApplication, MenuCategory } from '@/types/models';

export async function fetchMerchantApplication(): Promise<KycApplication | null> {
  const response = await apiClient.get<ApiResponse<KycApplication | null>>('/api/v1/merchant/apply');
  return response.data.data;
}

export async function applyForMerchant(): Promise<KycApplication> {
  const response = await apiClient.post<ApiResponse<KycApplication>>('/api/v1/merchant/apply');
  return response.data.data;
}

export async function cancelMerchantApplication(): Promise<void> {
  await apiClient.delete('/api/v1/merchant/apply');
}

// ── Merchant menu category management ────────────────────────────────────────

export async function fetchMerchantMenuCategories(): Promise<MenuCategory[]> {
  const response = await apiClient.get<{ data: MenuCategory[] }>('/api/merchant/v1/menu/categories');
  return response.data.data;
}

export async function createMerchantMenuCategory(name: string): Promise<MenuCategory> {
  const response = await apiClient.post<{ data: MenuCategory }>('/api/merchant/v1/menu/categories', { name });
  return response.data.data;
}

export async function updateMerchantMenuCategory(id: number, name: string): Promise<MenuCategory> {
  const response = await apiClient.put<{ data: MenuCategory }>(`/api/merchant/v1/menu/categories/${id}`, { name });
  return response.data.data;
}

export async function deleteMerchantMenuCategory(id: number): Promise<void> {
  await apiClient.delete(`/api/merchant/v1/menu/categories/${id}`);
}
