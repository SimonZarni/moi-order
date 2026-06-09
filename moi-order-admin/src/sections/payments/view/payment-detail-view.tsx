import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { settingsApi } from 'src/api/settings';
import { DashboardContent } from 'src/layouts/dashboard';
import { paymentsApi, type PaymentData } from 'src/api/payments';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  paid: 'success',
  succeeded: 'success',
  pending: 'warning',
  expired: 'warning',
  refunded: 'default',
  failed: 'error',
};

const formatPayableType = (type: string | null): string => {
  if (!type) return '—';
  return type.split('\\').pop()?.replace(/([A-Z])/g, ' $1').trim() ?? '—';
};

// ----------------------------------------------------------------------

export function PaymentDetailView() {
  const { id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [paymentMode, setPaymentMode] = useState<'stripe' | 'global_qr' | 'manual_qr'>('stripe');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [countdownLabel, setCountdownLabel] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      paymentsApi.get(id),
      settingsApi.getPaymentSettings(),
    ])
      .then(([p, s]) => {
        setPayment(p);
        setPaymentMode(s.payment_mode);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Live countdown — Stripe payments only (has expires_at + qr_data).
  useEffect(() => {
    const expiresAt = payment?.expires_at;
    const isStripe = payment?.qr_data !== null && payment?.qr_data !== undefined;
    if (!expiresAt || payment?.status !== 'pending' || !isStripe) {
      setCountdownLabel('');
      return undefined;
    }

    firedRef.current = false;

    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(secs);
      const mm = Math.floor(secs / 60);
      const ss = secs % 60;
      setCountdownLabel(`${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`);
      if (secs === 0 && !firedRef.current) {
        firedRef.current = true;
        handleRegenerateQr();
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment?.expires_at, payment?.status, payment?.qr_data]);

  const isStripeQr = payment?.qr_data !== null && payment?.qr_data !== undefined;

  const isQrExpired =
    isStripeQr &&
    payment !== null &&
    payment.status === 'pending' &&
    payment.qr_image_url !== null &&
    (payment.expires_at === null || new Date(payment.expires_at) < new Date());

  const canUploadQr =
    paymentMode === 'manual_qr' &&
    payment !== null &&
    payment.status === 'pending' &&
    !isStripeQr;

  const handleRegenerateQr = async () => {
    if (!payment) return;
    setRegenerating(true);
    setRegenerateError(null);
    try {
      const newPayment = await paymentsApi.regenerate(payment.id);
      setPayment(newPayment);
      router.replace(`/payments/${newPayment.id}`);
    } catch {
      setRegenerateError('Failed to regenerate QR code. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleUploadQr = async (file: File) => {
    if (!payment) return;
    setUploadingQr(true);
    setUploadError(null);
    try {
      const updated = await paymentsApi.uploadQr(payment.id, file);
      setPayment(updated);
    } catch {
      setUploadError('Failed to upload QR image. Please try again.');
    } finally {
      setUploadingQr(false);
    }
  };

  const handleRemoveQr = async () => {
    if (!payment) return;
    setUploadingQr(true);
    setUploadError(null);
    try {
      const updated = await paymentsApi.removeQr(payment.id);
      setPayment(updated);
    } catch {
      setUploadError('Failed to remove QR image. Please try again.');
    } finally {
      setUploadingQr(false);
    }
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

  if (!payment) {
    return (
      <DashboardContent>
        <Alert severity="error">Payment not found.</Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.back()}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Payment #{payment.id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {payment.stripe_intent_id ?? (payment.qr_image_url ? 'PromptPay QR' : 'Awaiting QR')}
          </Typography>
        </Box>
        <Label color={STATUS_COLORS[payment.status] ?? 'default'} sx={{ fontSize: 14, px: 2, py: 1 }}>
          {payment.status_label}
        </Label>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Payment Info" />
            <CardContent>
              <Stack spacing={1.5}>
                {[
                  ['Payment ID', `#${payment.id}`],
                  ['User', payment.user_name ?? '—'],
                  ['Reference', payment.stripe_intent_id ?? (payment.qr_image_url ? 'PromptPay QR' : '—')],
                  ['Amount', fCurrency(payment.amount / 100)],
                  ['Currency', payment.currency.toUpperCase()],
                  ['Status', payment.status_label],
                  ['Created', fDate(payment.created_at)],
                  ['Expires', payment.expires_at ? fDate(payment.expires_at) : '—'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {(payment.payable_type || payment.payable_id) && (
              <Card>
                <CardHeader title="Related Record" />
                <CardContent>
                  <Stack spacing={1}>
                    {[
                      ['Type', formatPayableType(payment.payable_type)],
                      ['ID', payment.payable_id ? `#${payment.payable_id}` : '—'],
                    ].map(([label, value]) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">{label}</Typography>
                        <Typography variant="body2" fontWeight={500}>{value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* ── QR Code card (Stripe) ───────────────────────────── */}
            {payment.qr_image_url && isStripeQr && (
              <Card>
                <CardHeader
                  title="QR Code"
                  action={
                    isQrExpired ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        disabled={regenerating}
                        onClick={handleRegenerateQr}
                        startIcon={
                          regenerating ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <Iconify icon="solar:restart-bold" width={16} />
                          )
                        }
                      >
                        {regenerating ? 'Generating…' : 'Regenerate QR'}
                      </Button>
                    ) : null
                  }
                />
                <Divider />
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pt: 2 }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={payment.qr_image_url}
                      alt="Payment QR Code"
                      sx={{
                        width: 200,
                        height: 200,
                        objectFit: 'contain',
                        borderRadius: 1,
                        opacity: isQrExpired ? 0.25 : 1,
                        filter: isQrExpired ? 'grayscale(1)' : 'none',
                        transition: 'opacity 0.2s, filter 0.2s',
                      }}
                    />
                    {isQrExpired && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Label color="error" sx={{ fontSize: 13, px: 1.5, py: 0.5 }}>
                          Expired
                        </Label>
                      </Box>
                    )}
                  </Box>
                  {!isQrExpired && countdownLabel !== '' && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      textAlign="center"
                      color={secondsLeft <= 60 ? 'error' : secondsLeft <= 120 ? 'warning.main' : 'text.secondary'}
                    >
                      Expires in: {countdownLabel}
                    </Typography>
                  )}
                  {regenerateError && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                      {regenerateError}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── Per-payment QR upload (manual_qr mode) ─────────── */}
            {canUploadQr && (
              <Card>
                <CardHeader title="Upload Payment QR" />
                <Divider />
                <CardContent>
                  {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {uploadError}
                    </Alert>
                  )}

                  {payment.qr_image_url ? (
                    <Stack spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={payment.qr_image_url}
                        alt="Payment QR Code"
                        sx={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          component="label"
                          disabled={uploadingQr}
                          startIcon={uploadingQr ? <CircularProgress size={14} /> : <Iconify icon="solar:pen-bold" width={14} />}
                        >
                          Replace QR
                          <input type="file" hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadQr(f); }} />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={uploadingQr}
                          onClick={handleRemoveQr}
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                        >
                          Remove
                        </Button>
                      </Stack>
                      <Typography variant="caption" color="text.secondary" textAlign="center">
                        User will see this QR when they open the payment screen.
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack alignItems="center" spacing={2}>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No QR uploaded yet. Upload a PromptPay QR image for this payment.
                      </Typography>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={uploadingQr}
                        startIcon={uploadingQr ? <CircularProgress size={14} color="inherit" /> : <Iconify icon="mingcute:add-line" width={14} />}
                      >
                        Upload QR Image
                        <input type="file" hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadQr(f); }} />
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── PromptPay QR (global_qr mode — read-only) ────────── */}
            {payment.qr_image_url && !isStripeQr && !canUploadQr && (
              <Card>
                <CardHeader title="PromptPay QR" />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    component="img"
                    src={payment.qr_image_url}
                    alt="Payment QR Code"
                    sx={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Global QR — manage from Payments Settings
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
