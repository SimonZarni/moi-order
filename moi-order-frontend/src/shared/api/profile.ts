import apiClient from '@/shared/api/client';
import { ApiResponse, User } from '@/types/models';

export async function updateProfile(
  name: string,
  dateOfBirth: string | null,
): Promise<User> {
  const response = await apiClient.put<ApiResponse<User>>('/api/v1/profile', {
    name,
    date_of_birth: dateOfBirth,
  });
  return response.data.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  passwordConfirmation: string,
): Promise<void> {
  await apiClient.put('/api/v1/profile/password', {
    current_password:      currentPassword,
    password:              newPassword,
    password_confirmation: passwordConfirmation,
  });
}
