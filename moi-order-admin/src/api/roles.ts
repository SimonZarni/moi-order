import type { AdminAccount, AdminRole, Permission } from 'src/types';

import apiClient from './client';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PermissionMatrix = {
  roles: AdminRole[];
  permissions: Permission[];
};

export type SendAdminOtpResult = {
  expires_in: number;
  resend_after: number;
};

export type CreateAdminData = {
  name: string;
  email: string;
  password: string;
  verified_token: string;
};

export type UpdateAdminData = {
  name?: string;
  email?: string;
  admin_role_id?: number;
};

// ── Permissions matrix ────────────────────────────────────────────────────────

export async function fetchPermissionMatrix(): Promise<PermissionMatrix> {
  const res = await apiClient.get<{ data: { roles: AdminRole[]; permissions: Permission[] } }>(
    '/roles/permissions'
  );
  const d = res.data.data ?? {};
  return {
    roles: Array.isArray(d.roles) ? d.roles : [],
    permissions: Array.isArray(d.permissions) ? d.permissions : [],
  };
}

export async function updateRolePermissions(roleId: number, permissionKeys: string[]): Promise<void> {
  await apiClient.put(`/roles/${roleId}/permissions`, { permission_keys: permissionKeys });
}

// ── Admin account OTP flow ────────────────────────────────────────────────────

export async function sendAdminOtp(email: string): Promise<SendAdminOtpResult> {
  const res = await apiClient.post<SendAdminOtpResult>('/admins/send-otp', { email });
  return res.data;
}

export async function verifyAdminOtp(email: string, otp: string): Promise<string> {
  const res = await apiClient.post<{ verified_token: string }>('/admins/verify-otp', { email, otp });
  return res.data.verified_token;
}

// ── Admin accounts ────────────────────────────────────────────────────────────

export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  const res = await apiClient.get<{ data: AdminAccount[] }>('/admins');
  return Array.isArray(res.data.data) ? res.data.data : [];
}

export async function createAdminAccount(data: CreateAdminData): Promise<AdminAccount> {
  const res = await apiClient.post<{ data: AdminAccount }>('/admins', data);
  return res.data.data;
}

export async function updateAdminAccount(id: number, data: UpdateAdminData): Promise<AdminAccount> {
  const res = await apiClient.put<{ data: AdminAccount }>(`/admins/${id}`, data);
  return res.data.data;
}

export async function toggleAdminAccount(id: number): Promise<AdminAccount> {
  const res = await apiClient.patch<{ data: AdminAccount }>(`/admins/${id}/toggle`);
  return res.data.data;
}

export async function deleteAdminAccount(id: number): Promise<void> {
  await apiClient.delete(`/admins/${id}`);
}
