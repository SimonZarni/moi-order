import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { restaurantsApi, type RestaurantListItem } from 'src/api/restaurants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  open: 'success',
  paused: 'warning',
  closed: 'error',
};

// ----------------------------------------------------------------------

export function RestaurantsView() {
  const router = useRouter();
  const [rows, setRows] = useState<RestaurantListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleTogglePlatformStatus = useCallback((row: RestaurantListItem) => {
    const next = row.platform_status === 'active' ? 'suspended' : 'active';
    setTogglingId(row.id);
    restaurantsApi
      .updatePlatformStatus(row.id, next)
      .then(({ platform_status }) => {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, platform_status } : r)));
      })
      .catch(() => {})
      .finally(() => setTogglingId(null));
  }, []);

  const fetchRestaurants = useCallback(() => {
    setLoading(true);
    restaurantsApi
      .list({
        page: page + 1,
        per_page: rowsPerPage,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: filterSearch.trim() || undefined,
      })
      .then(({ data, meta }) => {
        setRows(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, filterStatus, filterSearch]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Restaurants
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => router.push('/restaurants/new')}>
          Add Restaurant
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            placeholder="Search shops or menu items…"
            value={filterSearch}
            onChange={(e) => { setFilterSearch(e.target.value); setPage(0); }}
            startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
            sx={{ flexGrow: 1, maxWidth: 340, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e: SelectChangeEvent) => { setFilterStatus(e.target.value); setPage(0); }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {total} results
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Merchant</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Min Order</TableCell>
                  <TableCell align="right">Items</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {rows.map((row) => (
                      <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => router.push(`/restaurants/${row.id}`)}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            #{row.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {row.name}
                          </Typography>
                          {row.phone && (
                            <Typography variant="caption" color="text.secondary">
                              {row.phone}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.merchant.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.merchant.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                            {row.address ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {fCurrency(row.min_order_cents / 100)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{row.menu_items_count}</TableCell>
                        <TableCell align="right">{row.food_orders_count}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {row.is_delivery_available && (
                              <Chip size="small" label="Delivery" color="info" variant="outlined" />
                            )}
                            {row.is_pickup_available && (
                              <Chip size="small" label="Pickup" color="default" variant="outlined" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Tooltip title={row.platform_status === 'active' ? 'Platform active — click to suspend' : 'Platform suspended — click to activate'}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Switch
                                  size="small"
                                  checked={row.platform_status === 'active'}
                                  disabled={togglingId === row.id}
                                  onChange={() => handleTogglePlatformStatus(row)}
                                />
                                <Label color={row.platform_status === 'active' ? 'success' : 'error'}>
                                  {row.platform_status}
                                </Label>
                              </Box>
                            </Tooltip>
                            <Label color={STATUS_COLOR[row.status] ?? 'default'}>
                              {row.status}
                            </Label>
                          </Box>
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/restaurants/${row.id}`)}
                          >
                            <Iconify icon="solar:eye-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No shops match your search — try different keywords.
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
