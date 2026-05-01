import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Snackbar from '@mui/material/Snackbar';

import { fetchOrders, updateOrderStatus } from 'src/api/orders';

import type { FoodOrder, FoodOrderStatus } from 'src/types';

// ----------------------------------------------------------------------

const POLL_INTERVAL_MS = 15_000;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function formatCurrency(cents: number): string {
  return (cents / 100).toFixed(2) + ' THB';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

// ----------------------------------------------------------------------
// Status metadata
// ----------------------------------------------------------------------

interface StatusMeta {
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  sx?: Record<string, string>;
}

const STATUS_META: Record<FoodOrderStatus, StatusMeta> = {
  order_placed: { label: 'New Order', color: 'warning' },
  waiting_for_payment: { label: 'Waiting for Payment', color: 'info' },
  payment_confirmed: { label: 'Payment Confirmed', color: 'secondary' },
  preparing_food: { label: 'Preparing', color: 'default', sx: { bgcolor: '#f97316', color: '#fff' } },
  waiting_for_delivery: { label: 'Ready for Delivery', color: 'default', sx: { bgcolor: '#06b6d4', color: '#fff' } },
  delivery_on_the_way: { label: 'On the Way', color: 'default', sx: { bgcolor: '#14b8a6', color: '#fff' } },
  delivered: { label: 'Delivered', color: 'success' },
  completed: { label: 'Completed', color: 'default' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

const TERMINAL_STATUSES: FoodOrderStatus[] = ['completed', 'cancelled'];

// ----------------------------------------------------------------------
// Per-order action buttons
// ----------------------------------------------------------------------

interface OrderActionsProps {
  order: FoodOrder;
  onStatusUpdate: (id: number, status: FoodOrderStatus) => Promise<void>;
  updatingId: number | null;
}

function OrderActions({ order, onStatusUpdate, updatingId }: OrderActionsProps) {
  const isUpdating = updatingId === order.id;

  const primaryAction = getPrimaryAction(order.status);
  const canCancel = !TERMINAL_STATUSES.includes(order.status) && order.status !== 'order_placed';

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {primaryAction && (
        <Button
          variant="contained"
          size="small"
          disabled={isUpdating}
          onClick={() => onStatusUpdate(order.id, primaryAction.nextStatus)}
          sx={{ bgcolor: primaryAction.color, '&:hover': { bgcolor: primaryAction.hoverColor } }}
          startIcon={isUpdating ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {primaryAction.label}
        </Button>
      )}
      {canCancel && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          disabled={isUpdating}
          onClick={() => onStatusUpdate(order.id, 'cancelled')}
        >
          Cancel
        </Button>
      )}
    </Stack>
  );
}

interface PrimaryAction {
  label: string;
  nextStatus: FoodOrderStatus;
  color: string;
  hoverColor: string;
}

function getPrimaryAction(status: FoodOrderStatus): PrimaryAction | null {
  switch (status) {
    case 'order_placed':
      return { label: 'Accept Order', nextStatus: 'waiting_for_payment', color: '#22c55e', hoverColor: '#16a34a' };
    case 'payment_confirmed':
      return { label: 'Start Preparing', nextStatus: 'preparing_food', color: '#3b82f6', hoverColor: '#2563eb' };
    case 'preparing_food':
      return { label: 'Mark Ready', nextStatus: 'waiting_for_delivery', color: '#f97316', hoverColor: '#ea580c' };
    case 'waiting_for_delivery':
      return { label: 'Mark Picked Up', nextStatus: 'delivery_on_the_way', color: '#06b6d4', hoverColor: '#0891b2' };
    case 'delivery_on_the_way':
      return { label: 'Mark Delivered', nextStatus: 'delivered', color: '#14b8a6', hoverColor: '#0d9488' };
    case 'delivered':
      return { label: 'Complete', nextStatus: 'completed', color: '#6b7280', hoverColor: '#4b5563' };
    case 'waiting_for_payment':
    case 'completed':
    case 'cancelled':
      return null;
    default:
      return null;
  }
}

// ----------------------------------------------------------------------
// Order card
// ----------------------------------------------------------------------

interface OrderCardProps {
  order: FoodOrder;
  onStatusUpdate: (id: number, status: FoodOrderStatus) => Promise<void>;
  updatingId: number | null;
}

function OrderCard({ order, onStatusUpdate, updatingId }: OrderCardProps) {
  const meta = STATUS_META[order.status];
  const orderLabel = order.order_number ?? `#${order.id}`;

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ pb: '12px !important' }}>
        {/* Header row */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {orderLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(order.created_at)} · {timeAgo(order.created_at)}
            </Typography>
          </Box>
          <Chip
            label={meta.label}
            color={meta.color}
            size="small"
            sx={meta.sx ?? {}}
          />
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Items */}
        {order.items && order.items.length > 0 ? (
          <Stack spacing={0.25} mb={1}>
            {order.items.map((item) => (
              <Stack key={item.id} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {item.quantity}× {item.name}
                  {item.notes ? ` (${item.notes})` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.subtotal_cents)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : null}

        {/* Footer row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight={700}>
              {formatCurrency(order.total_cents)}
            </Typography>
            <Chip
              label={order.payment_method === 'cod' ? 'COD' : 'PromptPay'}
              size="small"
              variant="outlined"
              color={order.payment_method === 'cod' ? 'default' : 'primary'}
            />
          </Stack>
          <OrderActions order={order} onStatusUpdate={onStatusUpdate} updatingId={updatingId} />
        </Stack>

        {order.delivery_address && (
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            Deliver to: {order.delivery_address}
          </Typography>
        )}
        {order.customer_notes && (
          <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
            Note: {order.customer_notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------
// Section groupings
// ----------------------------------------------------------------------

const NEW_STATUSES: FoodOrderStatus[] = ['order_placed'];
const IN_PROGRESS_STATUSES: FoodOrderStatus[] = [
  'waiting_for_payment',
  'payment_confirmed',
  'preparing_food',
  'waiting_for_delivery',
  'delivery_on_the_way',
];
const DONE_STATUSES: FoodOrderStatus[] = ['delivered', 'completed', 'cancelled'];

interface OrderSectionProps {
  title: string;
  orders: FoodOrder[];
  onStatusUpdate: (id: number, status: FoodOrderStatus) => Promise<void>;
  updatingId: number | null;
  accent?: string;
}

function OrderSection({ title, orders, onStatusUpdate, updatingId, accent }: OrderSectionProps) {
  if (orders.length === 0) return null;
  return (
    <Box mb={3}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
        <Typography variant="subtitle1" fontWeight={700} color={accent ?? 'text.primary'}>
          {title}
        </Typography>
        <Chip label={orders.length} size="small" />
      </Stack>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
          updatingId={updatingId}
        />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Filter tabs
// ----------------------------------------------------------------------

type FilterValue = 'all' | 'active' | 'done';

// ----------------------------------------------------------------------
// Main view
// ----------------------------------------------------------------------

export function OrdersView() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [newOrderSnack, setNewOrderSnack] = useState(false);
  const prevCountRef = { current: 0 };

  const loadOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetchOrders({ per_page: 50 });
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders((prev) => {
        const prevNew = prev.filter((o) => o.status === 'order_placed').length;
        const nextNew = sorted.filter((o) => o.status === 'order_placed').length;
        if (silent && nextNew > prevNew) {
          setNewOrderSnack(true);
        }
        prevCountRef.current = prevNew;
        return sorted;
      });
      setError(null);
    } catch {
      if (!silent) setError('Failed to load orders. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    loadOrders(false);
  }, [loadOrders]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => loadOrders(true), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [loadOrders]);

  const handleStatusUpdate = useCallback(
    async (id: number, status: FoodOrderStatus) => {
      setUpdatingId(id);
      try {
        const updated = await updateOrderStatus(id, status);
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      } catch {
        setError('Failed to update order status. Please try again.');
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  const handleFilterChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: FilterValue | null) => {
      if (value) setFilter(value);
    },
    []
  );

  // Apply filter
  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return [...NEW_STATUSES, ...IN_PROGRESS_STATUSES].includes(o.status);
    if (filter === 'done') return DONE_STATUSES.includes(o.status);
    return true;
  });

  const newOrders = filteredOrders.filter((o) => NEW_STATUSES.includes(o.status));
  const inProgressOrders = filteredOrders.filter((o) => IN_PROGRESS_STATUSES.includes(o.status));
  const doneOrders = filteredOrders.filter((o) => DONE_STATUSES.includes(o.status));

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Orders
        </Typography>
        <Button variant="outlined" size="small" onClick={() => loadOrders(false)}>
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter tabs */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">All ({orders.length})</ToggleButton>
        <ToggleButton value="active">
          Active ({orders.filter((o) => [...NEW_STATUSES, ...IN_PROGRESS_STATUSES].includes(o.status)).length})
        </ToggleButton>
        <ToggleButton value="done">
          Completed ({orders.filter((o) => DONE_STATUSES.includes(o.status)).length})
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Order sections */}
      {filteredOrders.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary">No orders found.</Typography>
        </Box>
      ) : (
        <>
          <OrderSection
            title="New Orders"
            orders={newOrders}
            onStatusUpdate={handleStatusUpdate}
            updatingId={updatingId}
            accent="#f97316"
          />
          <OrderSection
            title="In Progress"
            orders={inProgressOrders}
            onStatusUpdate={handleStatusUpdate}
            updatingId={updatingId}
            accent="#3b82f6"
          />
          <OrderSection
            title="Completed / Cancelled"
            orders={doneOrders}
            onStatusUpdate={handleStatusUpdate}
            updatingId={updatingId}
          />
        </>
      )}

      {/* New order notification snackbar */}
      <Snackbar
        open={newOrderSnack}
        autoHideDuration={5000}
        onClose={() => setNewOrderSnack(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setNewOrderSnack(false)}>
          New orders have arrived!
        </Alert>
      </Snackbar>
    </Box>
  );
}
