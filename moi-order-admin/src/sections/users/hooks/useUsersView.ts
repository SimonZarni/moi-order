import type { ApiError } from 'src/types';
import type { UserData, UserRole } from 'src/api/users';

import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'src/routes/hooks';

import { usePresenceOnlineUsers } from 'src/hooks/usePresenceOnlineUsers';

import { usersApi } from 'src/api/users';
import { QUERY_KEYS } from 'src/api/queryKeys';
import { useAuth } from 'src/context/auth-context';

// ----------------------------------------------------------------------

type SuspendDialogState = { open: boolean; userId: number; userName: string };

export interface UseUsersViewResult {
  filteredUsers: UserData[];
  total: number;
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  filterName: string;
  filterRole: string;
  filterStatus: string;
  onlineIds: Set<number>;
  presenceReady: boolean;
  canManage: boolean;
  canDelete: boolean;
  superAdmin: boolean;
  suspendDialog: SuspendDialogState | null;
  setSuspendDialog: (v: SuspendDialogState | null) => void;
  updateParams: (updates: Record<string, string>) => void;
  navigateToUser: (id: number) => void;
  handleToggleAdmin: (id: number) => void;
  handlePromoteRole: (id: number, current: string) => void;
  handleSuspendConfirm: (suspendedUntil: string | null) => void;
  handleBan: (id: number) => void;
  handleActivate: (id: number) => void;
  handleRestore: (id: number) => void;
  handleDelete: (id: number, name: string) => void;
  handleExport: () => void;
}

// ----------------------------------------------------------------------

export function useUsersView(): UseUsersViewResult {
  const { hasPermission, isSuperAdmin } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { onlineIds, ready: presenceReady } = usePresenceOnlineUsers();
  const [searchParams, setSearchParams] = useSearchParams();
  const [suspendDialog, setSuspendDialog] = useState<SuspendDialogState | null>(null);

  const page        = Number(searchParams.get('page')     ?? '0');
  const rowsPerPage = Number(searchParams.get('per_page') ?? '10');
  const filterName  = searchParams.get('search')          ?? '';
  const filterRole  = searchParams.get('role')            ?? 'all';
  const filterStatus = searchParams.get('status')         ?? 'all';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams(
        (prev) => { Object.entries(updates).forEach(([k, v]) => prev.set(k, v)); return prev; },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Invalidate the whole users namespace so any cached page/filter combo refreshes.
  const invalidateUsers = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    [queryClient]
  );

  const listParams = { page: page + 1, per_page: rowsPerPage, search: filterName || undefined };

  const { data, isLoading } = useQuery<{ data: UserData[]; meta: { total: number } }, ApiError>({
    queryKey: QUERY_KEYS.users.list(listParams),
    queryFn: () => usersApi.list(listParams),
    staleTime: 30_000,
  });

  // Role and status filters are URL params but applied client-side on the fetched page.
  const filteredUsers = useMemo(() => {
    const users = data?.data ?? [];
    return users.filter((u) => {
      if (filterRole === 'admin' && !u.is_admin)  return false;
      if (filterRole === 'user'  &&  u.is_admin)  return false;
      if (filterStatus === 'deleted'   && !u.deleted_at)                              return false;
      if (filterStatus === 'active'    && (u.deleted_at || u.status !== 'active'))    return false;
      if (filterStatus === 'suspended' && (u.deleted_at || u.status !== 'suspended')) return false;
      if (filterStatus === 'banned'    && (u.deleted_at || u.status !== 'banned'))    return false;
      return true;
    });
  }, [data, filterRole, filterStatus]);

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const toggleAdminMutation = useMutation<UserData, ApiError, number>({
    mutationFn: (id) => usersApi.toggleAdmin(id),
    onSuccess: invalidateUsers,
  });

  const promoteRoleMutation = useMutation<UserData, ApiError, { id: number; role: UserRole }>({
    mutationFn: ({ id, role }) => usersApi.promoteRole(id, role),
    onSuccess: invalidateUsers,
  });

  const suspendMutation = useMutation<
    UserData,
    ApiError,
    { userId: number; suspendedUntil: string | null }
  >({
    mutationFn: ({ userId, suspendedUntil }) => usersApi.suspend(userId, suspendedUntil),
    onSuccess: invalidateUsers,
  });

  const banMutation = useMutation<UserData, ApiError, number>({
    mutationFn: (id) => usersApi.ban(id),
    onSuccess: invalidateUsers,
  });

  const activateMutation = useMutation<UserData, ApiError, number>({
    mutationFn: (id) => usersApi.activate(id),
    onSuccess: invalidateUsers,
  });

  const restoreMutation = useMutation<UserData, ApiError, number>({
    mutationFn: (id) => usersApi.restore(id),
    onSuccess: invalidateUsers,
  });

  const deleteMutation = useMutation<unknown, ApiError, number>({
    mutationFn: (id) => usersApi.destroy(id),
    onSuccess: invalidateUsers,
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleToggleAdmin = useCallback(
    (id: number) => { toggleAdminMutation.mutate(id); },
    [toggleAdminMutation]
  );

  const handlePromoteRole = useCallback(
    (id: number, current: string) => {
      const next = current === 'privileged' ? 'regular' : 'privileged';
      const label = next === 'privileged' ? 'Promote to Privileged' : 'Demote to Regular';
      if (!window.confirm(`${label} for this user?`)) return;
      promoteRoleMutation.mutate({ id, role: next as UserRole });
    },
    [promoteRoleMutation]
  );

  const handleSuspendConfirm = useCallback(
    (suspendedUntil: string | null) => {
      if (!suspendDialog) return;
      const { userId } = suspendDialog;
      setSuspendDialog(null);
      const isoUntil = suspendedUntil ? new Date(suspendedUntil).toISOString() : null;
      suspendMutation.mutate({ userId, suspendedUntil: isoUntil });
    },
    [suspendDialog, suspendMutation]
  );

  const handleBan = useCallback(
    (id: number) => {
      if (!window.confirm('Ban this user? They will be permanently blocked from logging in.')) return;
      banMutation.mutate(id);
    },
    [banMutation]
  );

  const handleActivate = useCallback(
    (id: number) => { activateMutation.mutate(id); },
    [activateMutation]
  );

  const handleRestore = useCallback(
    (id: number) => { restoreMutation.mutate(id); },
    [restoreMutation]
  );

  const handleDelete = useCallback(
    (id: number, name: string) => {
      if (!window.confirm(`Delete ${name}? This can be undone with Restore.`)) return;
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const navigateToUser = useCallback(
    (id: number) => { router.push(`/users/${id}`); },
    [router]
  );

  const handleExport = useCallback(() => {
    usersApi.export({ search: filterName.trim() || undefined }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }, [filterName]);

  // ── Return ────────────────────────────────────────────────────────────────────

  return {
    filteredUsers,
    total: data?.meta.total ?? 0,
    isLoading,
    page,
    rowsPerPage,
    filterName,
    filterRole,
    filterStatus,
    onlineIds,
    presenceReady,
    canManage: hasPermission('users.manage'),
    canDelete: hasPermission('users.delete'),
    superAdmin: isSuperAdmin(),
    suspendDialog,
    setSuspendDialog,
    updateParams,
    navigateToUser,
    handleToggleAdmin,
    handlePromoteRole,
    handleSuspendConfirm,
    handleBan,
    handleActivate,
    handleRestore,
    handleDelete,
    handleExport,
  };
}
