import apiClient from '@/shared/api/client';
import { ApiResponse, AuthResponse, User } from '@/types/models';

export interface OtpRequestResponse {
  otp_request_id: string;
  expires_in: number;
  phone_number: string;
}

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

export async function googleAuth(idToken: string): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/google', { id_token: idToken });
  return response.data.data;
}

export async function appleAuth(
  idToken: string,
  email?: string,
  name?: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/apple', {
    id_token: idToken,
    ...(email ? { email } : {}),
    ...(name ? { name } : {}),
  });
  return response.data.data;
}

export async function lineAuth(
  idToken: string,
  nonce?: string,
  name?: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/line', {
    id_token: idToken,
    ...(nonce ? { nonce } : {}),
    ...(name ? { name } : {}),
  });

  return response.data.data;
}

export async function requestOtp(
  phoneNumber: string,
  purpose: 'login' | 'register',
): Promise<OtpRequestResponse> {
  const response = await apiClient.post<ApiResponse<OtpRequestResponse>>('/api/v1/auth/otp/request', {
    phone_number: phoneNumber,
    purpose,
  });

  return response.data.data;
}

export async function verifyOtpLogin(
  otpRequestId: string,
  phoneNumber: string,
  pin: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/otp/verify', {
    otp_request_id: otpRequestId,
    phone_number: phoneNumber,
    pin,
    purpose: 'login',
  });

  return response.data.data;
}

export async function verifyOtpRegister(
  name: string,
  otpRequestId: string,
  phoneNumber: string,
  pin: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/otp/verify', {
    name,
    otp_request_id: otpRequestId,
    phone_number: phoneNumber,
    pin,
    purpose: 'register',
  });

  return response.data.data;
}
