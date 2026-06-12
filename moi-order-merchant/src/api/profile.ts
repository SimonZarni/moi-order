import { apiClient } from './client';

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.patch('/profile/password', payload);
}
