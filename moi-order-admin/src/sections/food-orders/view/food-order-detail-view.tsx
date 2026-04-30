import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
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

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  pending:   'warning',
  confirmed: 'info',
  ready:     'info',
  completed: 'success',
  cancelled: 'error',
};

const PAYMENT_LABEL: Record<string, string> = {
  credit_card: 'Credit Card',
  line_pay:    'LINE Pay',
  cash:        'Cash on Delivery',
};

// ----------------------------------------------------------------------

export function FoodOrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<FoodOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    foodOrdersApi
      .get(id)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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
          Order #{order.id}
        </Typography>
        <Label color={STATUS_COLOR[order.status] ?? 'default'}>{order.status}</Label>
      </Box>

      <Grid container spacing={3}>
        {/* Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader title="Order Summary" />
            <CardContent>
              <Stack spacing={1.5}>
                <InfoRow label="Restaurant" value={order.restaurant.name} />
                <InfoRow label="Customer" value={`${order.user.name} (${order.user.email})`} />
                <InfoRow label="Payment" value={PAYMENT_LABEL[order.payment_method] ?? order.payment_method} />
                <InfoRow label="Delivery To" value={order.delivery_address ?? 'Pickup'} />
                {order.customer_notes && (
                  <InfoRow label="Notes" value={order.customer_notes} />
                )}
                <Divider />
                <InfoRow label="Placed" value={fDate(order.created_at)} />
                {order.confirmed_at && <InfoRow label="Confirmed" value={fDate(order.confirmed_at)} />}
                {order.ready_at && <InfoRow label="Ready" value={fDate(order.ready_at)} />}
                {order.completed_at && <InfoRow label="Completed" value={fDate(order.completed_at)} />}
                {order.cancelled_at && <InfoRow label="Cancelled" value={fDate(order.cancelled_at)} />}
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
                      <TableCell>{item.name}</TableCell>
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
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {fCurrency(order.subtotal_cents / 100)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2" fontWeight={700}>
                        Total
                      </Typography>
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
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 110 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
