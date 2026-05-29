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

export interface RegisterOtpResponse {
  expires_in: number;
  resend_after: number;
}

export interface RegisterVerifyOtpResponse {
  verified_token: string;
  expires_in: number;
}

export async function requestRegisterOtp(
  name: string,
  email: string,
  password: string,
): Promise<RegisterOtpResponse> {
  const response = await apiClient.post<{ data: RegisterOtpResponse }>(
    '/auth/email/send-otp',
    { name, email, password },
  );
  return response.data.data;
}

export async function verifyRegisterOtp(
  email: string,
  otp: string,
): Promise<RegisterVerifyOtpResponse> {
  const response = await apiClient.post<{ data: RegisterVerifyOtpResponse }>(
    '/auth/email/verify-otp',
    { email, otp },
  );
  return response.data.data;
}

export async function completeRegisterWithOtp(
  name: string,
  email: string,
  password: string,
  verifiedToken: string,
): Promise<AuthResponse> {
  const response = await apiClient.post<{ data: AuthResponse }>(
    '/auth/email/register',
    { name, email, password, verified_token: verifiedToken },
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
