import apiClient from '@/shared/api/client';
import { ApiResponse, AuthResponse } from '@/types/models';

export interface EmailOtpRequestResponse {
  otp_request_id: string;
  expires_in: number;
  email: string;
}

export async function requestEmailOtp(
  email: string,
  purpose: 'login' | 'register',
): Promise<EmailOtpRequestResponse> {
  const response = await apiClient.post<ApiResponse<EmailOtpRequestResponse>>(
    '/api/v1/auth/email-otp/request',
    { email, purpose },
  );
  return response.data.data;
}

export async function verifyEmailOtp(
  otpRequestId: string,
  email: string,
  code: string,
  purpose: 'login' | 'register',
  name?: string,
): Promise<AuthResponse['data']> {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/email-otp/verify', {
    otp_request_id: otpRequestId,
    email,
    code,
    purpose,
    ...(name ? { name } : {}),
  });
  return response.data.data;
}
