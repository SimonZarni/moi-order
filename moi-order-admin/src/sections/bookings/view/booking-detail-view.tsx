import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { bookingsApi, type BookingDetailData } from 'src/api/bookings';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'default' | 'error'> = {
  completed: 'success',
  processing: 'warning',
  pending_payment: 'warning',
  payment_failed: 'error',
};

const PAYMENT_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  succeeded: 'success',
  pending: 'warning',
  failed: 'error',
};

// ----------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'right', maxWidth: '60%' }}>
        {value}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function BookingDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [booking, setBooking] = useState<BookingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookingsApi
      .get(id)
      .then(setBooking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = '';
    setSelectedFile(file);
    setUploadError('');
    setUploadSuccess(false);
  };

  const handleUpload = () => {
    if (!selectedFile || !id) return;
    setUploading(true);
    setUploadError('');
    bookingsApi
      .uploadEticket(id, selectedFile)
      .then((updated) => {
        setBooking(updated);
        setSelectedFile(null);
        setUploadSuccess(true);
      })
      .catch(() => setUploadError('Upload failed. Ensure the file is a valid PDF under 20 MB.'))
      .finally(() => setUploading(false));
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!booking) {
    return (
      <DashboardContent>
        <Alert severity="error">Booking not found.</Alert>
      </DashboardContent>
    );
  }

  const canUpload = booking.status === 'processing' || booking.status === 'completed';
  const statusColor = STATUS_COLORS[booking.status] ?? 'default';

  return (
    <DashboardContent>
      {/* ── Header ── */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/bookings')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h4">Order #{booking.id}</Typography>
            <Label color={statusColor}>{booking.status_label}</Label>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {booking.ticket?.name ?? '—'} · Ordered {fDate(booking.created_at)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* ── Left column ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Order Items */}
            <Card>
              <CardHeader title="Order Items" />
              <Divider />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Variant</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {booking.items?.length > 0 ? (
                    booking.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.variant?.name ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{item.quantity}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{item.price_snapshot.toLocaleString()} THB</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {item.subtotal.toLocaleString()} THB
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No items
                      </TableCell>
                    </TableRow>
                  )}
                  {booking.items?.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="body2" fontWeight={700}>Total</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" color="primary.main">
                          {booking.total !== null
                            ? `${booking.total.toLocaleString()} THB`
                            : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader title="Payment" />
              <CardContent>
                {booking.payment ? (
                  <Stack spacing={0.5} divider={<Divider />}>
                    <InfoRow
                      label="Status"
                      value={
                        <Label color={PAYMENT_COLORS[booking.payment.status] ?? 'default'}>
                          {booking.payment.status_label}
                        </Label>
                      }
                    />
                    <InfoRow
                      label="Amount"
                      value={fCurrency(booking.payment.amount / 100)}
                    />
                    <InfoRow label="Currency" value={booking.payment.currency} />
                    {booking.payment.expires_at && (
                      <InfoRow label="Expires" value={fDate(booking.payment.expires_at)} />
                    )}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No payment record yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* ── Right column ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Booking Summary */}
            <Card>
              <CardHeader title="Booking Info" />
              <CardContent>
                <Stack spacing={0.5} divider={<Divider />}>
                  <InfoRow label="Ticket" value={booking.ticket?.name ?? '—'} />
                  <InfoRow label="Visit Date" value={fDate(booking.visit_date)} />
                  <InfoRow label="Ordered" value={fDate(booking.created_at)} />
                  {booking.completed_at && (
                    <InfoRow label="Completed" value={fDate(booking.completed_at)} />
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Customer */}
            {booking.user && (
              <Card>
                <CardHeader title="Customer" />
                <CardContent>
                  <Stack spacing={0.5} divider={<Divider />}>
                    <InfoRow label="Name" value={booking.user.name} />
                    <InfoRow label="Email" value={booking.user.email} />
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* E-Ticket */}
            <Card>
              <CardHeader
                title="E-Ticket"
                action={
                  booking.has_eticket && (
                    <Chip size="small" label="Uploaded" color="success" variant="outlined" />
                  )
                }
              />
              <CardContent>
                {booking.has_eticket ? (
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:check-circle-bold" width={20} sx={{ color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        E-ticket is available to the customer in the app.
                      </Typography>
                    </Stack>
                    {booking.completed_at && (
                      <Typography variant="caption" color="text.disabled">
                        Uploaded on {fDate(booking.completed_at)}
                      </Typography>
                    )}
                    <Divider />
                    <Typography variant="caption" color="text.secondary">
                      Replace e-ticket:
                    </Typography>
                  </Stack>
                ) : !canUpload ? (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Iconify icon="solar:clock-circle-outline" width={18} sx={{ color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">
                      E-ticket can be uploaded once payment is confirmed.
                    </Typography>
                  </Stack>
                ) : null}

                {canUpload && (
                  <Stack spacing={1.5} sx={{ mt: booking.has_eticket ? 1 : 0 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={handleFileSelect}
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Iconify icon="eva:trending-up-fill" width={14} />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {selectedFile ? 'Change PDF' : 'Select PDF'}
                    </Button>
                    {selectedFile && (
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                        {selectedFile.name}
                      </Typography>
                    )}
                    {uploadError && (
                      <Alert severity="error" sx={{ py: 0.5 }}>
                        {uploadError}
                      </Alert>
                    )}
                    {uploadSuccess && (
                      <Alert severity="success" sx={{ py: 0.5 }}>
                        E-ticket uploaded successfully.
                      </Alert>
                    )}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={!selectedFile || uploading}
                      onClick={handleUpload}
                      startIcon={
                        uploading ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          <Iconify icon="eva:checkmark-fill" width={14} />
                        )
                      }
                    >
                      {uploading ? 'Uploading…' : 'Upload E-Ticket'}
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
