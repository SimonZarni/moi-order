import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { type UserData, usersApi } from 'src/api/users';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function UsersView() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [filterAdmin, setFilterAdmin] = useState('all');

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleAdmin = useCallback((id: number) => {
    usersApi.toggleAdmin(id)
      .then((updated) => setUsers((prev) => prev.map((u) => (u.id === id ? updated : u))))
      .catch(() => {});
  }, []);

  const handleRestore = useCallback((id: number) => {
    usersApi.restore(id)
      .then((updated) => setUsers((prev) => prev.map((u) => (u.id === id ? updated : u))))
      .catch(() => {});
  }, []);

  const filtered = filterAdmin === 'all'
    ? users
    : filterAdmin === 'admin'
      ? users.filter((u) => u.is_admin)
      : users.filter((u) => !u.is_admin);

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
            sx={{ flexGrow: 1, maxWidth: 320, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Role</InputLabel>
            <Select value={filterAdmin} label="Role" onChange={(e: SelectChangeEvent) => setFilterAdmin(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {total} results
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 700 }}>
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
                    {filtered.map((row) => (
                      <TableRow key={row.id} hover sx={{ opacity: row.deleted_at ? 0.55 : 1 }}>
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
                          <Label color={row.deleted_at ? 'error' : 'success'}>
                            {row.deleted_at ? 'Deleted' : 'Active'}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          {row.deleted_at ? (
                            <IconButton size="small" color="primary" onClick={() => handleRestore(row.id)} title="Restore">
                              <Iconify icon="eva:checkmark-fill" width={16} />
                            </IconButton>
                          ) : (
                            <IconButton size="small" onClick={() => handleToggleAdmin(row.id)} title={row.is_admin ? 'Remove admin' : 'Make admin'}>
                              <Iconify icon={row.is_admin ? 'solar:eye-closed-bold' : 'solar:check-circle-bold'} width={16} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
    </DashboardContent>
  );
}
