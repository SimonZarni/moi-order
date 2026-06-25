import type { UserData } from 'src/api/users';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate, fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { usersApi } from 'src/api/users';

import { useUsersView } from '../hooks/useUsersView';

// ----------------------------------------------------------------------

type StatusLabelColor = 'success' | 'warning' | 'error' | 'default';

function getAccountStatus(row: UserData): { label: string; color: StatusLabelColor } {
  if (row.deleted_at)          return { label: 'Deleted',   color: 'error' };
  if (row.status === 'banned') return { label: 'Banned',    color: 'error' };
  if (row.status === 'suspended') {
    const label = row.suspended_until
      ? `Suspended until ${fDate(row.suspended_until)}`
      : 'Suspended';
    return { label, color: 'warning' };
  }
  return { label: 'Active', color: 'success' };
}

// ── Suspend dialog ────────────────────────────────────────────────────────────

interface SuspendDialogProps {
  name: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (suspendedUntil: string | null) => void;
}

function SuspendDialog({ name, open, onClose, onConfirm }: SuspendDialogProps) {
  const [indefinite, setIndefinite] = useState(true);
  const [until, setUntil] = useState('');

  const handleConfirm = () => {
    onConfirm(indefinite ? null : until || null);
  };

  const confirmDisabled = !indefinite && !until;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Suspend {name}</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Switch checked={indefinite} onChange={(e) => setIndefinite(e.target.checked)} />}
          label="Suspend indefinitely"
          sx={{ mb: 2, mt: 0.5 }}
        />
        {!indefinite && (
          <TextField
            label="Suspend until"
            type="datetime-local"
            fullWidth
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().slice(0, 16) }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="warning" variant="contained" disabled={confirmDisabled}>
          Suspend
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Create User dialog ────────────────────────────────────────────────────────

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (user: UserData) => void;
}

function CreateUserDialog({ open, onClose, onCreated }: CreateUserDialogProps) {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [phone, setPhone]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const handleClose = () => {
    setName(''); setEmail(''); setPassword(''); setPhone('');
    setErrors({}); setSaving(false); onClose();
  };

  const handleSubmit = () => {
    setSaving(true);
    setErrors({});
    usersApi.create({
      name,
      email,
      password,
      ...(phone.trim() ? { phone_number: phone.trim() } : {}),
    })
      .then((user) => { onCreated(user); handleClose(); })
      .catch((err) => {
        const apiErrors = err?.response?.data?.errors ?? {};
        const flat: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : String(v); });
        if (Object.keys(flat).length === 0) flat.general = err?.response?.data?.message ?? 'Failed to create user.';
        setErrors(flat);
      })
      .finally(() => setSaving(false));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {errors.general && <Typography color="error" variant="body2">{errors.general}</Typography>}
          <TextField label="Full name" fullWidth value={name} onChange={(e) => setName(e.target.value)} error={!!errors.name} helperText={errors.name} />
          <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password ?? 'Minimum 8 characters'} />
          <TextField label="Phone number (optional)" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} error={!!errors.phone_number} helperText={errors.phone_number ?? 'e.g. 0812345678'} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !name || !email || !password}>
          {saving ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function UsersView() {
  const {
    filteredUsers,
    total,
    isLoading,
    page,
    rowsPerPage,
    filterName,
    filterRole,
    filterStatus,
    onlineIds,
    presenceReady,
    canManage,
    canDelete,
    superAdmin,
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
    handleUserCreated,
  } = useUsersView();

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>App Users</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" color="text.secondary">{total} total users</Typography>
          {canManage && (
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => setCreateOpen(true)}>
              Create User
            </Button>
          )}
          <Button variant="outlined" startIcon={<Iconify icon="solar:share-bold" />} onClick={handleExport}>
            Export Excel
          </Button>
        </Stack>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => updateParams({ search: e.target.value, page: '0' })}
            placeholder="Search by name or email..."
            startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
            sx={{ flexGrow: 1, maxWidth: 280, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select value={filterRole} label="Role" onChange={(e: SelectChangeEvent) => updateParams({ role: e.target.value })}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e: SelectChangeEvent) => updateParams({ status: e.target.value })}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="banned">Banned</MenuItem>
              <MenuItem value="deleted">Deleted</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {total} results
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredUsers.map((row) => {
                      const accountStatus = getAccountStatus(row);
                      const isDeleted    = Boolean(row.deleted_at);
                      const isRestricted = row.status !== 'active';
                      const isOnline = presenceReady ? onlineIds.has(row.id) : row.is_online;

                      return (
                        <TableRow
                          key={row.id}
                          hover
                          sx={{ opacity: isDeleted ? 0.55 : 1, cursor: 'pointer' }}
                          onClick={() => navigateToUser(row.id)}
                        >
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar src={row.profile_picture_url ?? undefined} alt={row.name}>
                                  {row.name.charAt(0).toUpperCase()}
                                </Avatar>
                                {isOnline && (
                                  <Box
                                    sx={{
                                      position: 'absolute', bottom: 0, right: 0,
                                      width: 10, height: 10, borderRadius: '50%',
                                      bgcolor: 'success.main',
                                      border: '2px solid white',
                                    }}
                                  />
                                )}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {row.is_admin ? (
                                <Label color="primary">Admin</Label>
                              ) : (
                                <Label color={row.is_privileged ? 'warning' : 'default'}>
                                  {row.is_privileged ? 'Privileged' : 'User'}
                                </Label>
                              )}
                              {row.is_merchant && (
                                <Label color="info">Merchant</Label>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {row.is_moi_verified
                              ? <Label color="success">Moi Verified</Label>
                              : row.email_verified_at
                                ? <Label color="default">Email Only</Label>
                                : <Label color="warning">Unverified</Label>}
                          </TableCell>
                          <TableCell>{fDate(row.created_at)}</TableCell>
                          <TableCell>
                            <Stack spacing={0.25}>
                              <Label color={accountStatus.color}>{accountStatus.label}</Label>
                              {row.status === 'suspended' && row.suspended_until && (
                                <Typography variant="caption" color="text.disabled">
                                  until {fDateTime(row.suspended_until)}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                              {isDeleted ? (
                                canManage && (
                                  <IconButton size="small" color="primary" onClick={() => handleRestore(row.id)} title="Restore account">
                                    <Iconify icon="eva:checkmark-fill" width={16} />
                                  </IconButton>
                                )
                              ) : (
                                <>
                                  {canManage && (
                                    isRestricted ? (
                                      <IconButton size="small" color="success" onClick={() => handleActivate(row.id)} title="Activate account">
                                        <Iconify icon="eva:checkmark-fill" width={16} />
                                      </IconButton>
                                    ) : (
                                      <IconButton size="small" color="warning" onClick={() => setSuspendDialog({ open: true, userId: row.id, userName: row.name })} title="Suspend account">
                                        <Iconify icon="solar:pause-bold" width={16} />
                                      </IconButton>
                                    )
                                  )}
                                  {canManage && row.status !== 'banned' && (
                                    <IconButton size="small" color="error" onClick={() => handleBan(row.id)} title="Ban account">
                                      <Iconify icon="solar:stop-bold" width={16} />
                                    </IconButton>
                                  )}
                                  {canManage && (
                                    <IconButton size="small" onClick={() => handleToggleAdmin(row.id)} title={row.is_admin ? 'Remove admin' : 'Make admin'}>
                                      <Iconify icon={row.is_admin ? 'solar:eye-closed-bold' : 'solar:check-circle-bold'} width={16} />
                                    </IconButton>
                                  )}
                                  {superAdmin && !row.is_admin && (
                                    <IconButton
                                      size="small"
                                      color={row.is_privileged ? 'default' : 'warning'}
                                      onClick={() => handlePromoteRole(row.id, row.user_role)}
                                      title={row.is_privileged ? 'Demote to regular user' : 'Promote to privileged'}
                                    >
                                      <Iconify icon={row.is_privileged ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} width={16} />
                                    </IconButton>
                                  )}
                                  {canDelete && (
                                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id, row.name)} title="Delete account">
                                      <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                    </IconButton>
                                  )}
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(_, newPage) => updateParams({ page: String(newPage) })}
          onRowsPerPageChange={(e) => updateParams({ per_page: e.target.value, page: '0' })}
        />
      </Card>

      {suspendDialog && (
        <SuspendDialog
          name={suspendDialog.userName}
          open={suspendDialog.open}
          onClose={() => setSuspendDialog(null)}
          onConfirm={handleSuspendConfirm}
        />
      )}

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(user) => { handleUserCreated(user); setCreateOpen(false); }}
      />
    </DashboardContent>
  );
}
