import apiClient from './client';

import type { ApiResponse, MerchantUser } from 'src/types';

// ----------------------------------------------------------------------

interface LoginResponse {
  user: MerchantUser;
  token: string;
}

export async function signIn(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
  return res.data.data;
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getMe(): Promise<MerchantUser> {
  const res = await apiClient.get<ApiResponse<MerchantUser>>('/auth/me');
  return res.data.data;
}
