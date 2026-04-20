import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { paymentsApi, type PaymentData } from 'src/api/payments';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  paid: 'success',
  pending: 'warning',
  expired: 'warning',
  refunded: 'default',
  failed: 'error',
};

// ----------------------------------------------------------------------

const formatPayableType = (type: string | null): string => {
  if (!type) return '—';
  return type.split('\\').pop()?.replace(/([A-Z])/g, ' $1').trim() ?? '—';
};

// ----------------------------------------------------------------------

export function PaymentDetailView() {
  const { id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    paymentsApi
      .get(id)
      .then(setPayment)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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
        <IconButton onClick={() => router.push('/payments')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Payment #{payment.id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {payment.stripe_intent_id ?? 'No Stripe intent'}
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
                  ['Stripe Intent', payment.stripe_intent_id ?? '—'],
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

            {payment.qr_image_url && (
              <Card>
                <CardHeader title="QR Code" />
                <Divider />
                <CardContent sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                  <Box
                    component="img"
                    src={payment.qr_image_url}
                    alt="Payment QR Code"
                    sx={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 1 }}
                  />
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
