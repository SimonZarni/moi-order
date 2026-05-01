import type { AdminAccount, AdminRole, Permission } from 'src/types';

import { TOKEN_KEY } from 'src/api/client';

const BASE = import.meta.env.VITE_API_BASE_URL;

const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ''}`,
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
  const res = await fetch(`${BASE}/roles/permissions`, { headers: authHeaders() });
  if (!res.ok) return { roles: [], permissions: [] };
  const json = await res.json();
  const d = json.data ?? {};
  return {
    roles: Array.isArray(d.roles) ? d.roles : [],
    permissions: Array.isArray(d.permissions) ? d.permissions : [],
  };
}

export async function updateRolePermissions(roleId: number, permissionKeys: string[]): Promise<void> {
  const res = await fetch(`${BASE}/roles/${roleId}/permissions`, {
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
  const res = await fetch(`${BASE}/admins`, { headers: authHeaders() });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message ?? `Server error ${res.status}`);
  }
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function createAdminAccount(data: CreateAdminData): Promise<AdminAccount> {
  const res = await fetch(`${BASE}/admins`, {
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
  const res = await fetch(`${BASE}/admins/${id}`, {
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
  const res = await fetch(`${BASE}/admins/${id}/toggle`, {
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
  const res = await fetch(`${BASE}/admins/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? 'Failed to remove admin.');
  }
}
