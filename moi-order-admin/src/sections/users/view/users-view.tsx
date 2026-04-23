import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

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

import { type UserData, usersApi } from 'src/api/users';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

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

// ── Suspend dialog ───────────────────────────────────────────────────────────

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

// ── Main view ────────────────────────────────────────────────────────────────

export function UsersView() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; userId: number; userName: string } | null>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    usersApi
      .list({ page: page + 1, per_page: rowsPerPage, search: filterName || undefined })
      .then(({ data, meta }) => {
        setUsers(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, filterName]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateRow = useCallback((id: number, updated: UserData) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }, []);

  const removeRow = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setTotal((t) => t - 1);
  }, []);

  const handleToggleAdmin = useCallback((id: number) => {
    usersApi.toggleAdmin(id).then((u) => updateRow(id, u)).catch(() => {});
  }, [updateRow]);

  const handleRestore = useCallback((id: number) => {
    usersApi.restore(id).then((u) => updateRow(id, u)).catch(() => {});
  }, [updateRow]);

  const handleDelete = useCallback((id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This can be undone with Restore.`)) return;
    usersApi.destroy(id).then(() => removeRow(id)).catch(() => {});
  }, [removeRow]);

  const handleSuspendConfirm = useCallback((suspendedUntil: string | null) => {
    if (!suspendDialog) return;
    const { userId } = suspendDialog;
    setSuspendDialog(null);
    // Convert datetime-local string to ISO if provided
    const isoUntil = suspendedUntil ? new Date(suspendedUntil).toISOString() : null;
    usersApi.suspend(userId, isoUntil).then((u) => updateRow(userId, u)).catch(() => {});
  }, [suspendDialog, updateRow]);

  const handleBan = useCallback((id: number) => {
    if (!window.confirm('Ban this user? They will be permanently blocked from logging in.')) return;
    usersApi.ban(id).then((u) => updateRow(id, u)).catch(() => {});
  }, [updateRow]);

  const handleActivate = useCallback((id: number) => {
    usersApi.activate(id).then((u) => updateRow(id, u)).catch(() => {});
  }, [updateRow]);

  const filtered = users.filter((u) => {
    if (filterRole === 'admin' && !u.is_admin) return false;
    if (filterRole === 'user'  &&  u.is_admin) return false;
    if (filterStatus === 'deleted'   && !u.deleted_at)                          return false;
    if (filterStatus === 'active'    && (u.deleted_at || u.status !== 'active'))    return false;
    if (filterStatus === 'suspended' && (u.deleted_at || u.status !== 'suspended')) return false;
    if (filterStatus === 'banned'    && (u.deleted_at || u.status !== 'banned'))    return false;
    return true;
  });

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>App Users</Typography>
        <Typography variant="body2" color="text.secondary">{total} total users</Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => { setFilterName(e.target.value); setPage(0); }}
            placeholder="Search by name or email..."
            startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
            sx={{ flexGrow: 1, maxWidth: 280, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select value={filterRole} label="Role" onChange={(e: SelectChangeEvent) => setFilterRole(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e: SelectChangeEvent) => setFilterStatus(e.target.value)}>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filtered.map((row) => {
                      const accountStatus = getAccountStatus(row);
                      const isDeleted    = Boolean(row.deleted_at);
                      const isRestricted = row.status !== 'active';

                      return (
                        <TableRow key={row.id} hover sx={{ opacity: isDeleted ? 0.55 : 1 }}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Avatar alt={row.name}>{row.name.charAt(0).toUpperCase()}</Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Label color={row.is_admin ? 'primary' : 'default'}>
                              {row.is_admin ? 'Admin' : 'User'}
                            </Label>
                          </TableCell>
                          <TableCell>
                            {row.email_verified_at
                              ? <Label color="success">Verified</Label>
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
                          <TableCell align="right">
                            <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                              {isDeleted ? (
                                <IconButton size="small" color="primary" onClick={() => handleRestore(row.id)} title="Restore account">
                                  <Iconify icon="eva:checkmark-fill" width={16} />
                                </IconButton>
                              ) : (
                                <>
                                  {isRestricted ? (
                                    <IconButton size="small" color="success" onClick={() => handleActivate(row.id)} title="Activate account">
                                      <Iconify icon="eva:checkmark-fill" width={16} />
                                    </IconButton>
                                  ) : (
                                    <IconButton size="small" color="warning" onClick={() => setSuspendDialog({ open: true, userId: row.id, userName: row.name })} title="Suspend account">
                                      <Iconify icon="solar:pause-bold" width={16} />
                                    </IconButton>
                                  )}
                                  {row.status !== 'banned' && (
                                    <IconButton size="small" color="error" onClick={() => handleBan(row.id)} title="Ban account">
                                      <Iconify icon="solar:stop-bold" width={16} />
                                    </IconButton>
                                  )}
                                  <IconButton size="small" onClick={() => handleToggleAdmin(row.id)} title={row.is_admin ? 'Remove admin' : 'Make admin'}>
                                    <Iconify icon={row.is_admin ? 'solar:eye-closed-bold' : 'solar:check-circle-bold'} width={16} />
                                  </IconButton>
                                  <IconButton size="small" color="error" onClick={() => handleDelete(row.id, row.name)} title="Delete account">
                                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                  </IconButton>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
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
    </DashboardContent>
  );
}
