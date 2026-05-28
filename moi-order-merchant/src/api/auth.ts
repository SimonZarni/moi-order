import type { MerchantUser } from '../types/models';
import { apiClient } from './client';

export interface AuthResponse {
  user: MerchantUser;
  token: string;
}

export interface OtpRequestResponse {
  otp_request_id: string;
  expires_in: number;
  phone_number: string;
}

export interface OtpVerifyResponse {
  user: MerchantUser;
  token: string;
  kyc_status: string | null;
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiClient.post<{ data: AuthResponse }>(
    '/auth/login',
    { email, password },
  );
  return response.data.data;
}

export async function requestOtp(
  phoneNumber: string,
): Promise<OtpRequestResponse> {
  const response = await apiClient.post<{ data: OtpRequestResponse }>(
    '/auth/otp/request',
    { phone_number: phoneNumber },
  );
  return response.data.data;
}

export async function verifyOtp(
  otpRequestId: string,
  phoneNumber: string,
  pin: string,
): Promise<OtpVerifyResponse> {
  const response = await apiClient.post<{ data: OtpVerifyResponse }>(
    '/auth/otp/verify',
    { otp_request_id: otpRequestId, phone_number: phoneNumber, pin },
  );
  return response.data.data;
}

export async function registerMerchant(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiClient.post<{ data: AuthResponse }>(
    '/auth/register',
    { name, email, password },
  );
  return response.data.data;
}

export async function getMe(): Promise<MerchantUser> {
  const response = await apiClient.get<{ data: MerchantUser }>('/auth/me');
  return response.data.data;
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/logout');
}
