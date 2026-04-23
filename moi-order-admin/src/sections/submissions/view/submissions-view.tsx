import type { SelectChangeEvent } from '@mui/material/Select';

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
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
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { servicesApi } from 'src/api/services';
import { DashboardContent } from 'src/layouts/dashboard';
import { submissionsApi, type SubmissionStatus, type SubmissionListItem } from 'src/api/submissions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const getServiceDisplay = (row: SubmissionListItem): string => {
  const slug = row.service_type?.service?.slug ?? '';
  const is90Day = slug.includes('90') || slug.includes('ninety');
  if (is90Day) return row.service_type?.name_mm ?? row.service_type?.name ?? '—';
  return row.service_type?.service?.name_mm ?? row.service_type?.service?.name ?? row.service_type?.name ?? '—';
};

// ----------------------------------------------------------------------

const STATUS_COLORS: Record<SubmissionStatus, 'warning' | 'success' | 'error'> = {
  pending_payment: 'warning',
  processing: 'warning',
  completed: 'success',
  payment_failed: 'error',
  cancelled: 'error',
};

type StatusOption = { value: SubmissionStatus; label: string };

const getStatusOptions = (current: string): StatusOption[] => {
  if (current === 'pending_payment') return [{ value: 'cancelled', label: 'Cancelled' }];
  if (current === 'processing') return [{ value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' }];
  return [];
};

type ServiceOption = { id: number; name: string };

// ----------------------------------------------------------------------

export function SubmissionsView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') ?? 'all');
  const [filterService, setFilterService] = useState(searchParams.get('service') ?? 'all');
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);

  useEffect(() => {
    servicesApi.list().then((data) => setServiceOptions(data.map((s) => ({ id: s.id, name: s.name_mm ?? s.name })))).catch(() => {});
  }, []);

  const fetchSubmissions = useCallback(() => {
    setLoading(true);
    submissionsApi
      .list({
        page: page + 1,
        per_page: rowsPerPage,
        search: filterName || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        service_id: filterService !== 'all' ? filterService : undefined,
      })
      .then(({ data, meta }) => {
        setSubmissions(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, filterName, filterStatus, filterService]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = (id: number, status: SubmissionStatus) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    submissionsApi.updateStatus(id, status).catch(() => fetchSubmissions());
  };

  const processingCount = submissions.filter((s) => s.status === 'processing' || s.status === 'pending_payment').length;
  const completedCount = submissions.filter((s) => s.status === 'completed').length;
  const cancelledCount = submissions.filter((s) => s.status === 'cancelled').length;

  const summary = [
    { label: 'Total', value: total, color: 'primary' as const },
    { label: 'Pending', value: processingCount, color: 'warning' as const },
    { label: 'Completed', value: completedCount, color: 'success' as const },
    { label: 'Cancelled', value: cancelledCount, color: 'error' as const },
  ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Service Submissions</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user-submitted service requests
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summary.map((s) => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            <Card>
              <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="h4" color={`${s.color}.main`}>
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
          <OutlinedInput
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setPage(0);
            }}
            placeholder="Search by user or service..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            }
            sx={{ flexGrow: 1, maxWidth: 300, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Service</InputLabel>
            <Select
              value={filterService}
              label="Service"
              onChange={(e: SelectChangeEvent) => {
                setFilterService(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All Services</MenuItem>
              {serviceOptions.map((s) => (
                <MenuItem key={s.id} value={String(s.id)}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e: SelectChangeEvent) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending_payment">Pending Payment</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="payment_failed">Payment Failed</MenuItem>
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
                  <TableCell>#</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Change Status</TableCell>
                  <TableCell align="right">View</TableCell>
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
                    {submissions.map((row, i) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/services/submissions/${row.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            #{page * rowsPerPage + i + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.user?.name ?? '—'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.user?.email ?? ''}
                          </Typography>
                        </TableCell>
                        <TableCell>{getServiceDisplay(row)}</TableCell>
                        <TableCell>
                          {(row.documents?.length ?? 0) > 0 ? (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Iconify icon="solar:eye-bold" width={14} sx={{ color: 'text.disabled' }} />
                              <Typography variant="caption" color="text.secondary">
                                {row.documents?.length} file(s)
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{fDate(row.created_at)}</TableCell>
                        <TableCell>
                          <Label color={STATUS_COLORS[row.status as SubmissionStatus] ?? 'default'}>{row.status_label}</Label>
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          {getStatusOptions(row.status).length > 0 ? (
                            <FormControl size="small" sx={{ minWidth: 130 }}>
                              <Select
                                value=""
                                displayEmpty
                                onChange={(e) => e.target.value && handleStatusChange(row.id, e.target.value as SubmissionStatus)}
                                sx={{ fontSize: 13 }}
                                renderValue={() => 'Change…'}
                              >
                                {getStatusOptions(row.status).map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/services/submissions/${row.id}`);
                            }}
                          >
                            <Iconify icon="solar:eye-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {submissions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          align="center"
                          sx={{ py: 6, color: 'text.secondary' }}
                        >
                          No submissions found
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
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </DashboardContent>
  );
}
