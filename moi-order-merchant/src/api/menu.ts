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
  // PHP only populates $_FILES for POST requests, not PUT/PATCH.
  // Use method spoofing: POST with _method=PUT so Laravel routes to the PUT
  // handler while PHP's multipart parser still populates $_FILES.
  data.append('_method', 'PUT');
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

export async function updateMenuItemStock(
  id: number,
  stockQuantity: number | null,
): Promise<MenuItem> {
  const response = await apiClient.patch<{ data: MenuItem }>(
    `/menu/items/${id}/stock`,
    { stock_quantity: stockQuantity },
  );
  return response.data.data;
}

// ── Session menu ─────────────────────────────────────────────────────────────

export async function getSessionMenuCategories(openingHourId: number): Promise<MenuCategory[]> {
  const response = await apiClient.get<{ data: MenuCategory[] }>(
    `/opening-hours/${openingHourId}/session-menu`,
  );
  return response.data.data;
}

export async function createSessionMenuCategory(
  openingHourId: number,
  name: string,
): Promise<MenuCategory> {
  const response = await apiClient.post<{ data: MenuCategory }>(
    `/opening-hours/${openingHourId}/session-menu`,
    { name },
  );
  return response.data.data;
}

export async function importSessionMenuCategories(
  openingHourId: number,
  categoryIds: number[],
): Promise<MenuCategory[]> {
  const response = await apiClient.post<{ data: MenuCategory[] }>(
    `/opening-hours/${openingHourId}/session-menu/import`,
    { category_ids: categoryIds },
  );
  return response.data.data;
}

export async function updateSessionMenuCategory(
  openingHourId: number,
  categoryId: number,
  name: string,
): Promise<MenuCategory> {
  const response = await apiClient.patch<{ data: MenuCategory }>(
    `/opening-hours/${openingHourId}/session-menu/${categoryId}`,
    { name },
  );
  return response.data.data;
}

export async function deleteSessionMenuCategory(
  openingHourId: number,
  categoryId: number,
): Promise<void> {
  await apiClient.delete(`/opening-hours/${openingHourId}/session-menu/${categoryId}`);
}
