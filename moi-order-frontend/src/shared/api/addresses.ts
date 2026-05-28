import apiClient from './client';
import { UserAddress } from '@/types/models';
import { ApiResponse } from '@/types/models';

export interface CreateAddressInput {
  label: 'home' | 'work' | 'other';
  address: string;
  building?: string | null;
  floor?: string | null;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_default?: boolean;
}

export type UpdateAddressInput = Partial<CreateAddressInput>;

export async function fetchAddresses(): Promise<UserAddress[]> {
  const res = await apiClient.get<{ data: UserAddress[] }>('/api/v1/addresses');
  return res.data.data;
}

export async function createAddress(input: CreateAddressInput): Promise<UserAddress> {
  const res = await apiClient.post<ApiResponse<UserAddress>>('/api/v1/addresses', input);
  return res.data.data;
}

export async function updateAddress(id: number, input: UpdateAddressInput): Promise<UserAddress> {
  const res = await apiClient.put<ApiResponse<UserAddress>>(`/api/v1/addresses/${id}`, input);
  return res.data.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/addresses/${id}`);
}

export async function setDefaultAddress(id: number): Promise<UserAddress> {
  const res = await apiClient.post<ApiResponse<UserAddress>>(`/api/v1/addresses/${id}/set-default`);
  return res.data.data;
}
