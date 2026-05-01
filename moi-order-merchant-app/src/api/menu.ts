import type { MenuCategory, MenuItem } from '../types/models';
import type { MenuItemStatus } from '../types/enums';
import { apiClient } from './client';

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const response = await apiClient.get<{ data: MenuCategory[] }>(
    '/menu/categories',
  );
  return response.data.data;
}

export async function createCategory(name: string): Promise<MenuCategory> {
  const response = await apiClient.post<{ data: MenuCategory }>(
    '/menu/categories',
    { name },
  );
  return response.data.data;
}

export async function updateCategory(
  id: number,
  name: string,
): Promise<MenuCategory> {
  const response = await apiClient.patch<{ data: MenuCategory }>(
    `/menu/categories/${id}`,
    { name },
  );
  return response.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/menu/categories/${id}`);
}

export async function createMenuItem(
  categoryId: number,
  data: FormData,
): Promise<MenuItem> {
  const response = await apiClient.post<{ data: MenuItem }>(
    `/menu/categories/${categoryId}/items`,
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export async function updateMenuItem(
  id: number,
  data: FormData,
): Promise<MenuItem> {
  const response = await apiClient.post<{ data: MenuItem }>(
    `/menu/items/${id}`,
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export async function deleteMenuItem(id: number): Promise<void> {
  await apiClient.delete(`/menu/items/${id}`);
}

export async function toggleMenuItemStatus(
  id: number,
  status: MenuItemStatus,
): Promise<MenuItem> {
  const response = await apiClient.patch<{ data: MenuItem }>(
    `/menu/items/${id}/status`,
    { status },
  );
  return response.data.data;
}
