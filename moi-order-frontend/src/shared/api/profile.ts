import apiClient from '@/shared/api/client';
import { ApiResponse, User } from '@/types/models';

export async function uploadProfilePicture(imageUri: string): Promise<User> {
  const filename = imageUri.split('/').pop() ?? 'photo.jpg';
  const ext      = (/\.(\w+)$/.exec(filename) ?? [])[1] ?? 'jpg';
  const type     = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  const formData = new FormData();
  formData.append('picture', { uri: imageUri, name: filename, type } as unknown as Blob);

  const response = await apiClient.post<ApiResponse<User>>('/api/v1/profile/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function removeProfilePicture(): Promise<User> {
  const response = await apiClient.delete<ApiResponse<User>>('/api/v1/profile/picture');
  return response.data.data;
}

export async function updateProfile(
  name: string,
  email: string,
  phoneNumber: string | null,
  dateOfBirth: string | null,
): Promise<User> {
  const response = await apiClient.put<ApiResponse<User>>('/api/v1/profile', {
    name,
    email,
    phone_number: phoneNumber,
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

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/api/v1/profile');
}

export async function updateSimulatedDate(date: string | null): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>('/api/v1/profile/simulated-date', { date });
  return response.data.data;
}
