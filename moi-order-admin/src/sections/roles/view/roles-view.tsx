import type { AdminAccount, AdminRole, AdminRoleSlug, Permission } from 'src/types';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  deleteAdminAccount,
  fetchAdminAccounts,
  toggleAdminAccount,
  updateAdminAccount,
  fetchPermissionMatrix,
  updateRolePermissions,
} from 'src/api/roles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const ROLE_COLORS: Record<AdminRoleSlug, 'error' | 'warning'> = {
  super_admin: 'error',
  admin: 'warning',
};

// ----------------------------------------------------------------------

type AdminDialogProps = {
  open: boolean;
  admin: AdminAccount | null;
  roles: AdminRole[];
  onClose: () => void;
  onSaved: (a: AdminAccount) => void;
};

function AdminDialog({ open, admin, roles, onClose, onSaved }: AdminDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && admin) {
      setName(admin.name);
      setEmail(admin.email);
      setRoleId(admin.role.id);
      setError('');
    }
  }, [open, admin]);

  const handleSave = useCallback(async () => {
    if (!admin || !roleId) return;
    setSaving(true);
    setError('');
    try {
      const saved = await updateAdminAccount(admin.id, { name, email, admin_role_id: roleId as number });
      onSaved(saved);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }, [admin, name, email, roleId, onSaved, onClose]);

  const isValid = name.trim() && email.trim() && roleId !== '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Admin Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {error && <Typography variant="caption" color="error">{error}</Typography>}
          <TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={roleId} label="Role" onChange={(e) => setRoleId(e.target.value as number)}>
              {roles.filter((r) => r.slug !== 'super_admin').map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  <Label color={ROLE_COLORS[r.slug]}>{r.label}</Label>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid || saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function RolesView() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminAccount | null>(null);

  // Local editable permission keys per role id
  const [localKeys, setLocalKeys] = useState<Record<number, Set<string>>>({});
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchAdminAccounts().catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : 'Failed to load admin accounts.');
        return [] as AdminAccount[];
      }),
      fetchPermissionMatrix().catch(() => ({ roles: [], permissions: [] })),
    ])
      .then(([accountsData, matrixData]) => {
        setAdmins(accountsData);
        setRoles(matrixData.roles);
        setPermissions(matrixData.permissions);

        const initial: Record<number, Set<string>> = {};
        matrixData.roles.forEach((r) => {
          initial[r.id] = new Set(r.permission_keys);
        });
        setLocalKeys(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (!map[p.group]) map[p.group] = [];
      map[p.group].push(p);
    });
    return map;
  }, [permissions]);

  const handleTogglePermission = useCallback((roleId: number, key: string) => {
    setLocalKeys((prev) => {
      const next = new Set(prev[roleId]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...prev, [roleId]: next };
    });
  }, []);

  const handleSavePermissions = useCallback(async (role: AdminRole) => {
    setSavingRoleId(role.id);
    setSaveError('');
    try {
      await updateRolePermissions(role.id, Array.from(localKeys[role.id] ?? []));
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSavingRoleId(null);
    }
  }, [localKeys]);

  const handleToggleActive = useCallback(async (admin: AdminAccount) => {
    try {
      const updated = await toggleAdminAccount(admin.id);
      setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      // silently ignore — UI stays unchanged
    }
  }, []);

  const handleDelete = useCallback(async (admin: AdminAccount) => {
    try {
      await deleteAdminAccount(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch {
      // silently ignore
    }
  }, []);

  const handleSaved = useCallback((saved: AdminAccount) => {
    setAdmins((prev) => {
      const exists = prev.find((a) => a.id === saved.id);
      return exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
    });
  }, []);

  const filtered = useMemo(
    () => admins.filter((a) =>
      a.name.toLowerCase().includes(filterName.toLowerCase()) ||
      a.email.toLowerCase().includes(filterName.toLowerCase())
    ),
    [admins, filterName],
  );

  const paginated = filtered.slice(page * 10, page * 10 + 10);

  const editableRoles = roles.filter((r) => r.slug !== 'super_admin');
  const superAdminRole = roles.find((r) => r.slug === 'super_admin');

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Roles & Permissions</Typography>
          <Typography variant="body2" color="text.secondary">Manage admin accounts and role permissions</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/account/create-admin')}
        >
          Add Admin
        </Button>
      </Box>

      {loadError && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="error.dark">{loadError}</Typography>
        </Box>
      )}

      {/* Admin Accounts Table */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Search admin accounts…"
            startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
            sx={{ flexGrow: 1, maxWidth: 320, height: 40 }}
          />
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Admin</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>Loading…</TableCell>
                  </TableRow>
                ) : paginated.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Label color={ROLE_COLORS[row.role.slug]}>{row.role.label}</Label>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={row.is_active}
                        onChange={() => handleToggleActive(row)}
                        size="small"
                        disabled={row.role.slug === 'super_admin'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => { setEditAdmin(row); setDialogOpen(true); }}
                        disabled={row.role.slug === 'super_admin'}
                      >
                        <Iconify icon="solar:pen-bold" width={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={row.role.slug === 'super_admin'}
                        onClick={() => handleDelete(row)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={() => {}}
        />
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader
          title="Permissions Matrix"
          subheader="Super Admin always has all permissions and cannot be edited"
        />
        <Divider />
        {saveError && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Typography variant="caption" color="error">{saveError}</Typography>
          </Box>
        )}
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 220 }}>Permission</TableCell>
                  {superAdminRole && (
                    <TableCell align="center">
                      <Label color="error">{superAdminRole.label}</Label>
                    </TableCell>
                  )}
                  {editableRoles.map((r) => (
                    <TableCell key={r.id} align="center">
                      <Stack alignItems="center" spacing={1}>
                        <Label color={ROLE_COLORS[r.slug]}>{r.label}</Label>
                        <Button
                          size="small"
                          variant="contained"
                          disabled={savingRoleId === r.id}
                          onClick={() => handleSavePermissions(r)}
                        >
                          {savingRoleId === r.id ? 'Saving…' : 'Save'}
                        </Button>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(grouped).map(([group, perms]) => (
                  <>
                    <TableRow key={`group-${group}`}>
                      <TableCell
                        colSpan={1 + roles.length}
                        sx={{ bgcolor: 'background.neutral', py: 0.75 }}
                      >
                        <Typography variant="overline" color="text.secondary">{group}</Typography>
                      </TableCell>
                    </TableRow>
                    {perms.map((perm) => (
                      <TableRow key={perm.key} hover>
                        <TableCell>
                          <Typography variant="body2">{perm.label}</Typography>
                          <Typography variant="caption" color="text.disabled">{perm.key}</Typography>
                        </TableCell>
                        {superAdminRole && (
                          <TableCell align="center">
                            <Checkbox checked disabled size="small" />
                          </TableCell>
                        )}
                        {editableRoles.map((role) => (
                          <TableCell key={role.id} align="center">
                            <Checkbox
                              size="small"
                              checked={localKeys[role.id]?.has(perm.key) ?? false}
                              onChange={() => handleTogglePermission(role.id, perm.key)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <AdminDialog
        open={dialogOpen}
        admin={editAdmin}
        roles={roles}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
      />
    </DashboardContent>
  );
}
