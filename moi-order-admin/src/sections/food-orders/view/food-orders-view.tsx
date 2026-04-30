import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
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

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { type FoodOrderListItem, foodOrdersApi } from 'src/api/foodOrders';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  pending:   'warning',
  confirmed: 'info',
  ready:     'info',
  completed: 'success',
  cancelled: 'error',
};

const PAYMENT_LABEL: Record<string, string> = {
  credit_card: 'Card',
  line_pay:    'LINE Pay',
  cash:        'Cash',
};

// ----------------------------------------------------------------------

export function FoodOrdersView() {
  const router = useRouter();
  const [rows, setRows] = useState<FoodOrderListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    foodOrdersApi
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
    fetchOrders();
  }, [fetchOrders]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Food Orders
        </Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            placeholder="Search user, restaurant…"
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="ready">Ready</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
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
                  <TableCell>Restaurant</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Placed</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            #{row.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.restaurant.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {PAYMENT_LABEL[row.payment_method] ?? row.payment_method}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {fCurrency(row.total_cents / 100)}
                          </Typography>
                        </TableCell>
                        <TableCell>{fDate(row.created_at)}</TableCell>
                        <TableCell>
                          <Label color={STATUS_COLOR[row.status] ?? 'default'}>
                            {row.status}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/food-orders/${row.id}`)}
                          >
                            <Iconify icon="solar:eye-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No orders found
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
