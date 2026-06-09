import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
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
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { usePaymentsView } from '../hooks/usePaymentsView';

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
  const {
    payments,
    total,
    isLoading,
    autoPayment,
    paymentMode,
    globalQrImageUrl,
    bankName,
    bankAccountNumber,
    bankAccountName,
    togglingAutoPayment,
    updatingMode,
    uploadingGlobalQr,
    page,
    rowsPerPage,
    filterStatus,
    filterSearch,
    summary,
    updateParams,
    navigateToPayment,
    handleToggleAutoPayment,
    handleUpdateMode,
    handleUploadGlobalQr,
    handleRemoveGlobalQr,
    handleExport,
  } = usePaymentsView();

  const [pendingMode, setPendingMode] = useState(paymentMode);
  const isDirty = pendingMode !== paymentMode;

  useEffect(() => {
    setPendingMode(paymentMode);
  }, [paymentMode]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Payments
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button variant="outlined" startIcon={<Iconify icon="solar:share-bold" />} onClick={handleExport}>
            Export Excel
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* ── Payment Configuration card ─────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Payment Configuration
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Payment Method
              </Typography>

              <ToggleButtonGroup
                value={pendingMode}
                exclusive
                disabled={updatingMode}
                onChange={(_, val) => { if (val) setPendingMode(val); }}
                size="small"
                sx={{ mb: 1.5 }}
              >
                <ToggleButton value="stripe" sx={{ px: 2, textTransform: 'none', fontWeight: 600, fontSize: 12 }}>
                  Stripe
                </ToggleButton>
                <ToggleButton value="global_qr" sx={{ px: 2, textTransform: 'none', fontWeight: 600, fontSize: 12 }}>
                  Global QR
                </ToggleButton>
                <ToggleButton value="manual_qr" sx={{ px: 2, textTransform: 'none', fontWeight: 600, fontSize: 12 }}>
                  Per-Submission QR
                </ToggleButton>
              </ToggleButtonGroup>

              <Box sx={{ mb: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!isDirty || updatingMode}
                  onClick={() => handleUpdateMode(pendingMode, { bankName: bankName ?? undefined, bankAccountNumber: bankAccountNumber ?? undefined, bankAccountName: bankAccountName ?? undefined })}
                  startIcon={updatingMode ? <CircularProgress size={14} color="inherit" /> : null}
                >
                  Save
                </Button>
              </Box>

              {pendingMode === 'global_qr' && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Global QR Image
                  </Typography>
                  {globalQrImageUrl ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={globalQrImageUrl}
                        sx={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                      />
                      <Stack spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          component="label"
                          disabled={uploadingGlobalQr}
                          startIcon={uploadingGlobalQr ? <CircularProgress size={14} /> : <Iconify icon="solar:pen-bold" width={14} />}
                        >
                          Replace
                          <input type="file" hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadGlobalQr(f); }} />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={handleRemoveGlobalQr}
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      disabled={uploadingGlobalQr}
                      startIcon={uploadingGlobalQr ? <CircularProgress size={14} /> : <Iconify icon="mingcute:add-line" width={14} />}
                    >
                      Upload QR Image
                      <input type="file" hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadGlobalQr(f); }} />
                    </Button>
                  )}
                </Box>
              )}

              {pendingMode === 'manual_qr' && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={<Iconify icon="solar:settings-bold-duotone" width={14} />}
                    label="Upload QR per payment from payment detail page"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: 12 }}
                  />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Auto Payment
              </Typography>
              <Chip
                label={autoPayment ? '⚡ Auto Payment: ON' : '🔒 Auto Payment: OFF'}
                color={autoPayment ? 'success' : 'default'}
                variant="outlined"
                onClick={handleToggleAutoPayment}
                disabled={togglingAutoPayment}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Summary cards ───────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {summary.map((s) => (
              <Grid key={s.label} size={{ xs: 6 }}>
                <Card sx={{ height: '100%' }}>
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
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search user, email or payment ID…"
            value={filterSearch}
            onChange={(e) => updateParams({ search: e.target.value, page: '0' })}
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
              onChange={(e: SelectChangeEvent) => updateParams({ status: e.target.value, page: '0' })}
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
                  <TableCell>Reference</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right" width={60} />
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
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
                        onClick={() => navigateToPayment(row.id)}
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
                            {row.stripe_intent_id ?? (row.qr_image_url ? 'PromptPay QR' : '—')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatPayableType(row.payable_type)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {fNumber(row.amount / 100)}
                          </Typography>
                        </TableCell>
                        <TableCell>{fDate(row.created_at)}</TableCell>
                        <TableCell>
                          <Label color={STATUS_COLORS[row.status] ?? 'default'}>{row.status_label}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); navigateToPayment(row.id); }}
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
          onPageChange={(_, newPage) => updateParams({ page: String(newPage) })}
          onRowsPerPageChange={(e) => updateParams({ per_page: e.target.value, page: '0' })}
        />
      </Card>
    </DashboardContent>
  );
}
