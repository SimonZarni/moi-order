import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { foodOrdersApi, type FoodOrderDetail } from 'src/api/foodOrders';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { OrderChatDialog } from './order-chat-dialog';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  order_placed:          'warning',
  waiting_for_payment:   'warning',
  payment_confirmed:     'info',
  preparing_food:        'info',
  waiting_for_delivery:  'info',
  delivery_on_the_way:   'info',
  delivered:             'info',
  completed:             'success',
  cancelled:             'error',
};

const PAYMENT_LABEL: Record<string, string> = {
  cod:        'Cash on Delivery',
  prompt_pay: 'PromptPay',
};

// ----------------------------------------------------------------------

export function FoodOrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<FoodOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    foodOrdersApi
      .get(id)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmPayment = useCallback(() => {
    if (!id || !order) return;
    setConfirming(true);
    setConfirmError(null);
    foodOrdersApi
      .confirmPayment(id)
      .then((updated) => setOrder(updated))
      .catch(() => setConfirmError('Failed to confirm payment. Please try again.'))
      .finally(() => setConfirming(false));
  }, [id, order]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!order) {
    return (
      <DashboardContent>
        <Typography color="error">Order not found.</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          size="small"
          startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Order {order.order_number ?? `#${order.id.slice(0, 8)}`}
        </Typography>
        <Label color={STATUS_COLOR[order.status] ?? 'default'}>{order.status_label}</Label>

        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:chat-round-dots-bold" />}
          onClick={() => setChatOpen(true)}
        >
          View Chat
        </Button>

        {order.status === 'waiting_for_payment' && (
          <Button
            variant="contained"
            color="success"
            disabled={confirming}
            onClick={handleConfirmPayment}
            startIcon={confirming ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="eva:checkmark-fill" />}
          >
            Confirm Payment
          </Button>
        )}
      </Box>

      {confirmError && (
        <Alert severity="error" sx={{ mb: 3 }}>{confirmError}</Alert>
      )}

      <Grid container spacing={3}>
        {/* Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader title="Order Summary" />
            <CardContent>
              <Stack spacing={1.5}>
                <InfoRow label="Restaurant" value={order.restaurant.name} />
                {order.restaurant.phone && (
                  <InfoRow label="Restaurant Phone" value={order.restaurant.phone} />
                )}
                <Divider />
                <InfoRow label="Customer" value={order.user.name} />
                <InfoRow label="Email" value={order.user.email} />
                {order.user.phone && (
                  <InfoRow label="Customer Phone" value={order.user.phone} />
                )}
                {order.contact_no && order.contact_no !== order.user.phone && (
                  <InfoRow label="Order Contact" value={order.contact_no} />
                )}
                <Divider />
                <InfoRow label="Payment" value={PAYMENT_LABEL[order.payment_method] ?? order.payment_method} />
                <InfoRow label="Delivery To" value={order.delivery_address ?? 'Pickup'} />
                {order.customer_notes && (
                  <InfoRow label="Notes" value={order.customer_notes} />
                )}
                <Divider />
                <InfoRow label="Placed" value={fDate(order.created_at)} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Items + totals */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardHeader title="Items" />
            <CardContent sx={{ pt: 0 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2">{item.name}</Typography>
                        {item.notes && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {item.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {fCurrency(item.price_cents / 100)}
                      </TableCell>
                      <TableCell align="right">
                        {fCurrency(item.subtotal_cents / 100)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{fCurrency(order.subtotal_cents / 100)}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {fCurrency(order.total_cents / 100)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <OrderChatDialog open={chatOpen} orderId={String(order.id)} onClose={() => setChatOpen(false)} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 148 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
