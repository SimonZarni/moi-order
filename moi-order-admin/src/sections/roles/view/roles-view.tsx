import type { SelectChangeEvent } from '@mui/material/Select';

type AdminRole = 'super_admin' | 'admin' | 'manager' | 'viewer';

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string;
  isActive: boolean;
  createdAt: Date;
};

import { useState, useCallback } from 'react';

const genId = () => Math.random().toString(36).slice(2, 10);

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const ROLE_COLORS: Record<AdminRole, 'error' | 'warning' | 'info' | 'default'> = {
  super_admin: 'error', admin: 'warning', manager: 'info', viewer: 'default',
};

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin', admin: 'Admin', manager: 'Manager', viewer: 'Viewer',
};

type Permission = { key: string; label: string; super_admin: boolean; admin: boolean; manager: boolean; viewer: boolean };

const PERMISSIONS: Permission[] = [
  { key: 'places.manage', label: 'Manage Places', super_admin: true, admin: true, manager: true, viewer: false },
  { key: 'attractions.manage', label: 'Manage Attractions', super_admin: true, admin: true, manager: true, viewer: false },
  { key: 'bookings.view', label: 'View Bookings', super_admin: true, admin: true, manager: true, viewer: true },
  { key: 'bookings.manage', label: 'Manage Bookings', super_admin: true, admin: true, manager: false, viewer: false },
  { key: 'payments.view', label: 'View Payments', super_admin: true, admin: true, manager: true, viewer: false },
  { key: 'payments.refund', label: 'Issue Refunds', super_admin: true, admin: true, manager: false, viewer: false },
  { key: 'users.view', label: 'View Users', super_admin: true, admin: true, manager: true, viewer: true },
  { key: 'users.ban', label: 'Ban/Unban Users', super_admin: true, admin: true, manager: false, viewer: false },
  { key: 'services.manage', label: 'Manage Services', super_admin: true, admin: true, manager: true, viewer: false },
  { key: 'submissions.view', label: 'View Submissions', super_admin: true, admin: true, manager: true, viewer: true },
  { key: 'submissions.manage', label: 'Manage Submissions', super_admin: true, admin: true, manager: true, viewer: false },
  { key: 'reports.view', label: 'View Reports', super_admin: true, admin: true, manager: true, viewer: true },
  { key: 'roles.manage', label: 'Manage Roles & Admins', super_admin: true, admin: false, manager: false, viewer: false },
];

const MOCK_ADMINS: AdminAccount[] = [
  { id: 'adm-1', name: 'Chris (Director)', email: 'chris@moiorder.com', role: 'super_admin', avatarUrl: '/assets/images/avatar/avatar-25.webp', isActive: true, createdAt: new Date(Date.now() - 86400000 * 365) },
  { id: 'adm-2', name: 'Yan Paing Oo', email: 'yan@moiorder.com', role: 'admin', avatarUrl: '/assets/images/avatar/avatar-2.webp', isActive: true, createdAt: new Date(Date.now() - 86400000 * 180) },
  { id: 'adm-3', name: 'Support Team', email: 'support@moiorder.com', role: 'manager', avatarUrl: '/assets/images/avatar/avatar-3.webp', isActive: true, createdAt: new Date(Date.now() - 86400000 * 90) },
  { id: 'adm-4', name: 'Content Editor', email: 'editor@moiorder.com', role: 'viewer', avatarUrl: '/assets/images/avatar/avatar-4.webp', isActive: false, createdAt: new Date(Date.now() - 86400000 * 30) },
];

// ----------------------------------------------------------------------

type AdminDialogProps = { open: boolean; admin: AdminAccount | null; onClose: () => void; onSave: (a: AdminAccount) => void };

function AdminDialog({ open, admin, onClose, onSave }: AdminDialogProps) {
  const [name, setName] = useState(admin?.name ?? '');
  const [email, setEmail] = useState(admin?.email ?? '');
  const [role, setRole] = useState<AdminRole>(admin?.role ?? 'viewer');

  const handleSave = () => {
    onSave({ id: admin?.id ?? genId(), name, email, role, avatarUrl: admin?.avatarUrl ?? '/assets/images/avatar/avatar-25.webp', isActive: admin?.isActive ?? true, createdAt: admin?.createdAt ?? new Date() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{admin ? 'Edit Admin Account' : 'Add Admin Account'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={role} label="Role" onChange={(e) => setRole(e.target.value as AdminRole)}>
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                <MenuItem key={r} value={r}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Label color={ROLE_COLORS[r]}>{ROLE_LABELS[r]}</Label>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!name.trim() || !email.trim()}>{admin ? 'Save' : 'Add Admin'}</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function RolesView() {
  const [admins, setAdmins] = useState<AdminAccount[]>(MOCK_ADMINS);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminAccount | null>(null);

  const filtered = admins.filter((a) => a.name.toLowerCase().includes(filterName.toLowerCase()) || a.email.toLowerCase().includes(filterName.toLowerCase()));
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSave = useCallback((a: AdminAccount) => {
    setAdmins((prev) => { const e = prev.find((x) => x.id === a.id); return e ? prev.map((x) => (x.id === a.id ? a : x)) : [...prev, a]; });
  }, []);

  const toggleActive = (id: string) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Roles & Permissions</Typography>
          <Typography variant="body2" color="text.secondary">Manage admin accounts and access control</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => { setEditAdmin(null); setDialogOpen(true); }}>
          Add Admin
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Admin Accounts Table */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <OutlinedInput
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Search admin accounts..."
                startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
                sx={{ flexGrow: 1, maxWidth: 320, height: 40 }}
              />
            </Box>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Admin</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Login Access</TableCell>
                      <TableCell align="center">Active</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar src={row.avatarUrl} />
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell><Label color={ROLE_COLORS[row.role]}>{ROLE_LABELS[row.role]}</Label></TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Iconify icon="socials:google" width={18} />
                            <Iconify icon="eva:checkmark-fill" width={18} sx={{ color: 'text.disabled' }} />
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Switch checked={row.isActive} onChange={() => toggleActive(row.id)} size="small" color="primary" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => { setEditAdmin(row); setDialogOpen(true); }}>
                            <Iconify icon="solar:pen-bold" width={16} />
                          </IconButton>
                          <IconButton size="small" color="error" disabled={row.role === 'super_admin'}>
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
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={() => {}}
            />
          </Card>
        </Grid>

        {/* Permissions Matrix */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="Permissions Matrix" subheader="What each role can do" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 220 }}>Permission</TableCell>
                      {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                        <TableCell key={r} align="center"><Label color={ROLE_COLORS[r]}>{ROLE_LABELS[r]}</Label></TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {PERMISSIONS.map((perm) => (
                      <TableRow key={perm.key} hover>
                        <TableCell><Typography variant="body2">{perm.label}</Typography></TableCell>
                        {(['super_admin', 'admin', 'manager', 'viewer'] as AdminRole[]).map((role) => (
                          <TableCell key={role} align="center">
                            {perm[role] ? (
                              <Iconify icon="eva:checkmark-fill" width={18} sx={{ color: 'success.main' }} />
                            ) : (
                              <Iconify icon="mingcute:close-line" width={18} sx={{ color: 'text.disabled' }} />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AdminDialog open={dialogOpen} admin={editAdmin} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </DashboardContent>
  );
}
