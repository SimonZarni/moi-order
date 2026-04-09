import apiClient from '@/shared/api/client';
import { ApiResponse, AuthResponse, User } from '@/types/models';

export async function login(email: string, password: string): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', { email, password });
  return response.data.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout');
}

export async function fetchMe(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/api/v1/auth/me');
  return response.data.data;
}
