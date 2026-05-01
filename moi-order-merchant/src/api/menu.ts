import apiClient from './client';

import type { ApiResponse, ItemPayload, MenuCategoryDetail, MenuItemDetail } from 'src/types';

// ----------------------------------------------------------------------

export async function fetchMenu(): Promise<MenuCategoryDetail[]> {
  const res = await apiClient.get<ApiResponse<MenuCategoryDetail[]>>('/menu/categories');
  return res.data.data;
}

export async function createCategory(name: string, sortOrder?: number): Promise<MenuCategoryDetail> {
  const res = await apiClient.post<ApiResponse<MenuCategoryDetail>>('/menu/categories', {
    name,
    sort_order: sortOrder,
  });
  return res.data.data;
}

export async function updateCategory(
  id: number,
  name: string,
  sortOrder?: number
): Promise<MenuCategoryDetail> {
  const res = await apiClient.put<ApiResponse<MenuCategoryDetail>>(`/menu/categories/${id}`, {
    name,
    sort_order: sortOrder,
  });
  return res.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/menu/categories/${id}`);
}

export async function createItem(
  categoryId: number,
  payload: ItemPayload,
  photo?: File | null
): Promise<MenuItemDetail> {
  if (photo) {
    const fd = new FormData();
    fd.append('name', payload.name);
    if (payload.description != null) fd.append('description', payload.description);
    fd.append('price_cents', String(payload.price_cents));
    fd.append('status', payload.status);
    if (payload.sort_order != null) fd.append('sort_order', String(payload.sort_order));
    fd.append('photo', photo);
    const res = await apiClient.post<ApiResponse<MenuItemDetail>>(
      `/menu/categories/${categoryId}/items`,
      fd,
      { headers: { 'Content-Type': undefined } }
    );
    return res.data.data;
  }
  const res = await apiClient.post<ApiResponse<MenuItemDetail>>(
    `/menu/categories/${categoryId}/items`,
    payload
  );
  return res.data.data;
}

export async function updateItem(
  id: number,
  payload: Partial<ItemPayload>,
  photo?: File | null
): Promise<MenuItemDetail> {
  if (photo) {
    const fd = new FormData();
    fd.append('_method', 'PUT');
    if (payload.name != null) fd.append('name', payload.name);
    if (payload.description != null) fd.append('description', payload.description);
    if (payload.price_cents != null) fd.append('price_cents', String(payload.price_cents));
    if (payload.status != null) fd.append('status', payload.status);
    if (payload.sort_order != null) fd.append('sort_order', String(payload.sort_order));
    fd.append('photo', photo);
    const res = await apiClient.post<ApiResponse<MenuItemDetail>>(`/menu/items/${id}`, fd, {
      headers: { 'Content-Type': undefined },
    });
    return res.data.data;
  }
  const res = await apiClient.put<ApiResponse<MenuItemDetail>>(`/menu/items/${id}`, payload);
  return res.data.data;
}

export async function deleteItem(id: number): Promise<void> {
  await apiClient.delete(`/menu/items/${id}`);
}
