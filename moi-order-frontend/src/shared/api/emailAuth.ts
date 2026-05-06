import apiClient from '@/shared/api/client';
import { ApiResponse, AuthResponse } from '@/types/models';

export interface SendEmailOtpResponse {
  expires_in: number;
  resend_after: number;
}

export interface VerifyEmailOtpResponse {
  verified_token: string;
  expires_in: number;
}

export async function sendEmailOtp(
  email: string,
  purpose: 'registration' | 'password_reset',
): Promise<SendEmailOtpResponse> {
  const response = await apiClient.post<ApiResponse<SendEmailOtpResponse>>(
    '/api/v1/auth/email/send-otp',
    { email, purpose },
  );
  return response.data.data;
}

export async function verifyEmailOtp(
  email: string,
  otp: string,
  purpose: 'registration' | 'password_reset',
): Promise<VerifyEmailOtpResponse> {
  const response = await apiClient.post<ApiResponse<VerifyEmailOtpResponse>>(
    '/api/v1/auth/email/verify-otp',
    { email, otp, purpose },
  );
  return response.data.data;
}

export async function completeEmailRegistration(
  email: string,
  name: string,
  password: string,
  passwordConfirmation: string,
  verifiedToken: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/email/register', {
    email,
    name,
    password,
    password_confirmation: passwordConfirmation,
    verified_token: verifiedToken,
  });
  return response.data.data;
}

export async function resetPassword(
  email: string,
  password: string,
  passwordConfirmation: string,
  verifiedToken: string,
): Promise<void> {
  await apiClient.post('/api/v1/auth/email/reset-password', {
    email,
    password,
    password_confirmation: passwordConfirmation,
    verified_token: verifiedToken,
  });
}
