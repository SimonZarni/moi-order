import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { paymentsApi, type PaymentData, type PaymentStats } from 'src/api/payments';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  succeeded: 'success',
  pending: 'warning',
  failed: 'error',
};

const formatPayableType = (type: string | null): string => {
  if (!type) return '—';
  return type.split('\\').pop()?.replace(/([A-Z])/g, ' $1').trim() ?? '—';
};

// ----------------------------------------------------------------------

export function PaymentsView() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    paymentsApi.stats().then(setStats).catch(() => {});
  }, []);

  const fetchPayments = useCallback(() => {
    setLoading(true);
    paymentsApi
      .list({
        page: page + 1,
        per_page: rowsPerPage,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: filterSearch.trim() || undefined,
      })
      .then(({ data, meta }) => {
        setPayments(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, filterStatus, filterSearch]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const summary = [
    { label: 'Total Revenue', value: fCurrency((stats?.total_revenue ?? 0) / 100), color: 'primary' as const },
    { label: 'Succeeded', value: String(stats?.succeeded_count ?? 0), color: 'success' as const },
    { label: 'Pending', value: String(stats?.pending_count ?? 0), color: 'warning' as const },
    { label: 'Failed', value: String(stats?.failed_count ?? 0), color: 'error' as const },
  ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Payments
        </Typography>
        <Button variant="outlined" startIcon={<Iconify icon="solar:share-bold" />}>
          Export
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summary.map((s) => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            <Card>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="h5" color={`${s.color}.main`}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search user, email or Stripe ID…"
            value={filterSearch}
            onChange={(e) => { setFilterSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={16} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e: SelectChangeEvent) => { setFilterStatus(e.target.value); setPage(0); }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="succeeded">Succeeded</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {total} results
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell width={80}>No. / ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Stripe Intent</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right" width={60} />
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
                    {payments.map((row, index) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/payments/${row.id}`)}
                      >
                        <TableCell>
                          <Typography variant="caption" color="text.disabled" display="block">
                            {page * rowsPerPage + index + 1}.
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            #{row.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.user_name ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                            {row.stripe_intent_id ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatPayableType(row.payable_type)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {fCurrency(row.amount / 100)}
                          </Typography>
                        </TableCell>
                        <TableCell>{fDate(row.created_at)}</TableCell>
                        <TableCell>
                          <Label color={STATUS_COLORS[row.status] ?? 'default'}>{row.status_label}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); router.push(`/payments/${row.id}`); }}
                          >
                            <Iconify icon="solar:eye-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No payments found
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
