import type { ApiError } from 'src/types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { type DailyInvoice, invoicesApi } from 'src/api/invoices';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

function fCents(cents: number): string {
  const baht = cents / 100;
  return `฿${baht.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card sx={{ p: 3, flex: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="h4" sx={{ mt: 0.5 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </Card>
  );
}

// ----------------------------------------------------------------------

export function InvoicesView() {
  const today = new Date().toISOString().slice(0, 10);

  const [rows, setRows]           = useState<DailyInvoice[]>([]);
  const [meta, setMeta]           = useState<{ restaurant_count: number; total_orders: number; total_customer_cents: number; total_platform_fee_cents: number; total_payout_cents: number; total: number; last_page: number; current_page: number } | null>(null);
  const [loading, setLoading]     = useState(false);
  const [page, setPage]           = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filterDate, setFilterDate]   = useState(today);
  const [error, setError]         = useState<string | null>(null);

  const [qrOpen, setQrOpen]             = useState(false);
  const [qrUrl, setQrUrl]               = useState<string | null>(null);
  const [qrName, setQrName]             = useState('');

  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [confirmId, setConfirmId]       = useState<number | null>(null);
  const [confirmName, setConfirmName]   = useState('');
  const [confirming, setConfirming]     = useState(false);

  const [generating, setGenerating]     = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    invoicesApi
      .list(filterDate, page + 1, rowsPerPage)
      .then(({ data, meta: m }) => {
        setRows(data);
        setMeta(m);
      })
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filterDate, page, rowsPerPage]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleConfirmOpen = (inv: DailyInvoice) => {
    setConfirmId(inv.id);
    setConfirmName(inv.restaurant?.name ?? '');
    setConfirmOpen(true);
  };

  const handleConfirm = useCallback(() => {
    if (!confirmId) return;
    setConfirming(true);
    invoicesApi
      .confirm(confirmId)
      .then(() => { setConfirmOpen(false); fetch(); })
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setConfirming(false));
  }, [confirmId, fetch]);

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    invoicesApi
      .generate(filterDate)
      .then(() => fetch())
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setGenerating(false));
  }, [filterDate, fetch]);

  const handleViewQr = (inv: DailyInvoice) => {
    setQrUrl(inv.restaurant?.payment_qr_url ?? null);
    setQrName(inv.restaurant?.name ?? '');
    setQrOpen(true);
  };

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Daily Cashout Invoices</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            type="date"
            size="small"
            value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); setPage(0); }}
            InputLabelProps={{ shrink: true }}
            label="Date"
          />
          <Button
            variant="outlined"
            onClick={handleGenerate}
            disabled={generating}
            startIcon={<Iconify icon="solar:restart-bold" />}
          >
            {generating ? 'Generating…' : 'Generate'}
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Summary cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <SummaryCard label="Restaurants" value={String(meta?.restaurant_count ?? 0)} />
        <SummaryCard label="Total Orders" value={String(meta?.total_orders ?? 0)} />
        <SummaryCard label="Customer Total" value={fCents(meta?.total_customer_cents ?? 0)} />
        <SummaryCard label="Platform Fee" value={fCents(meta?.total_platform_fee_cents ?? 0)} />
        <SummaryCard label="Payout Total" value={fCents(meta?.total_payout_cents ?? 0)} />
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Restaurant</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Customer Total</TableCell>
                  <TableCell align="right">Fee (5%)</TableCell>
                  <TableCell align="right">Payout</TableCell>
                  <TableCell>QR</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid At</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No invoices for {fDate(filterDate)}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((inv) => (
                    <TableRow key={inv.id ?? `${inv.date}-${inv.restaurant?.id}`} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{inv.restaurant?.name ?? '—'}</Typography>
                      </TableCell>
                      <TableCell align="right">{inv.order_count}</TableCell>
                      <TableCell align="right">{fCents(inv.customer_total_cents)}</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary' }}>{fCents(inv.platform_fee_cents)}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700} color="success.main">
                          {fCents(inv.payout_cents)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {inv.restaurant?.has_payment_qr ? (
                          <IconButton size="small" onClick={() => handleViewQr(inv)} title="View QR Code">
                            <Iconify icon="solar:eye-bold" width={18} />
                          </IconButton>
                        ) : (
                          <Typography variant="caption" color="warning.main">No QR</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Label color={inv.status === 'paid' ? 'success' : 'warning'}>
                          {inv.status_label}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {inv.paid_at ? fDate(inv.paid_at) : '—'}
                      </TableCell>
                      <TableCell align="right">
                        {inv.status === 'pending' && inv.id !== null && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleConfirmOpen(inv)}
                            startIcon={<Iconify icon="eva:checkmark-fill" />}
                          >
                            Confirm
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={meta?.total ?? 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>

      {/* QR Code dialog */}
      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Payment QR — {qrName}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          {qrUrl ? (
            <Box component="img" src={qrUrl} alt="Payment QR" sx={{ width: '100%', maxWidth: 280, borderRadius: 2 }} />
          ) : (
            <Typography color="text.secondary">No QR uploaded</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm cashout dialog */}
      <Dialog open={confirmOpen} onClose={() => !confirming && setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Cashout</DialogTitle>
        <DialogContent>
          <Typography>
            Mark payout to <strong>{confirmName}</strong> as paid? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={confirming}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="success"
            disabled={confirming}
          >
            {confirming ? 'Confirming…' : 'Confirm Paid'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
