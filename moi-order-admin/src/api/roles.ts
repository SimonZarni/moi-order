import type { AdminAccount, AdminRole, Permission } from 'src/types';

const BASE = import.meta.env.VITE_API_BASE_URL;

const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type PermissionMatrix = {
  roles: AdminRole[];
  permissions: Permission[];
};

export type CreateAdminData = {
  name: string;
  email: string;
  password: string;
  admin_role_id: number;
};

export type UpdateAdminData = {
  name?: string;
  email?: string;
  admin_role_id?: number;
};

// ── Permissions matrix ────────────────────────────────────────────────────────

export async function fetchPermissionMatrix(): Promise<PermissionMatrix> {
  const res = await fetch(`${BASE}/admin/v1/roles/permissions`, { headers: authHeaders() });
  const json = await res.json();
  return json.data as PermissionMatrix;
}

export async function updateRolePermissions(roleId: number, permissionKeys: string[]): Promise<void> {
  const res = await fetch(`${BASE}/admin/v1/roles/${roleId}/permissions`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ permission_keys: permissionKeys }),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? 'Failed to save permissions.');
  }
}

// ── Admin accounts ────────────────────────────────────────────────────────────

export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  const res = await fetch(`${BASE}/admin/v1/admins`, { headers: authHeaders() });
  const json = await res.json();
  return json.data as AdminAccount[];
}

export async function createAdminAccount(data: CreateAdminData): Promise<AdminAccount> {
  const res = await fetch(`${BASE}/admin/v1/admins`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json();
    throw Object.assign(new Error(json.message ?? 'Failed to create admin.'), { errors: json.errors });
  }

  const json = await res.json();
  return json.data as AdminAccount;
}

export async function updateAdminAccount(id: number, data: UpdateAdminData): Promise<AdminAccount> {
  const res = await fetch(`${BASE}/admin/v1/admins/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json();
    throw Object.assign(new Error(json.message ?? 'Failed to update admin.'), { errors: json.errors });
  }

  const json = await res.json();
  return json.data as AdminAccount;
}

export async function toggleAdminAccount(id: number): Promise<AdminAccount> {
  const res = await fetch(`${BASE}/admin/v1/admins/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? 'Failed to toggle admin.');
  }

  const json = await res.json();
  return json.data as AdminAccount;
}

export async function deleteAdminAccount(id: number): Promise<void> {
  const res = await fetch(`${BASE}/admin/v1/admins/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? 'Failed to remove admin.');
  }
}
