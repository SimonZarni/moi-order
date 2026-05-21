import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './OrderCard.styles';
import { colours } from '../../../shared/theme/colours';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { ORDER_STATUS } from '../../../types/enums';
import type { FoodOrder } from '../../../types/models';

interface OrderAction {
  label: string;
  nextStatus: string;
}

const ORDER_ACTIONS: Partial<Record<string, OrderAction>> = {
  [ORDER_STATUS.OrderPlaced]:          { label: 'Accept',       nextStatus: ORDER_STATUS.WaitingForPayment },
  [ORDER_STATUS.PaymentConfirmed]:     { label: 'Start Prep',   nextStatus: ORDER_STATUS.PreparingFood },
  [ORDER_STATUS.PreparingFood]:        { label: 'Mark Ready',   nextStatus: ORDER_STATUS.WaitingForDelivery },
  [ORDER_STATUS.WaitingForDelivery]:   { label: 'Picked Up',    nextStatus: ORDER_STATUS.DeliveryOnTheWay },
  [ORDER_STATUS.DeliveryOnTheWay]:     { label: 'Delivered',    nextStatus: ORDER_STATUS.Delivered },
  [ORDER_STATUS.Delivered]:            { label: 'Complete',     nextStatus: ORDER_STATUS.Completed },
};

const STATUS_COLOURS: Record<string, string> = {
  [ORDER_STATUS.OrderPlaced]:        colours.warning,
  [ORDER_STATUS.WaitingForPayment]:  colours.warning,
  [ORDER_STATUS.PaymentConfirmed]:   colours.primary,
  [ORDER_STATUS.PreparingFood]:      colours.primary,
  [ORDER_STATUS.WaitingForDelivery]: colours.primaryDark,
  [ORDER_STATUS.DeliveryOnTheWay]:   colours.primaryDark,
  [ORDER_STATUS.Delivered]:          colours.success,
  [ORDER_STATUS.Completed]:          colours.success,
  [ORDER_STATUS.Cancelled]:          colours.error,
};

interface OrderCardProps {
  order: FoodOrder;
  onUpdateStatus: (orderId: number, newStatus: string) => void;
  onPress?: () => void;
}

export function OrderCard({ order, onUpdateStatus, onPress }: OrderCardProps): React.JSX.Element {
  const { isDesktop } = useResponsive();
  const action = ORDER_ACTIONS[order.status];
  const statusColour = STATUS_COLOURS[order.status] ?? colours.medium;
  const itemCount = order.items?.length ?? 0;
  const initials = (order.user.name ?? '?').slice(0, 2).toUpperCase();

  const handleAction = useCallback(() => {
    if (action) onUpdateStatus(order.id, action.nextStatus);
  }, [action, order.id, onUpdateStatus]);

  const inner = (
    <View style={styles.cardContent}>
      {/* Left status strip */}
      <View style={[styles.statusStrip, { backgroundColor: statusColour }]} />

      <View style={styles.cardBody}>
        <View style={styles.topRow}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: statusColour + '22' }]}>
            <Text style={[styles.avatarText, { color: statusColour }]}>{initials}</Text>
          </View>

          <View style={styles.middleBlock}>
            <Text style={styles.orderNumber}>{order.order_number ?? `#${order.id}`}</Text>
            <Text style={styles.customer}>{order.user.name}</Text>
          </View>

          <View style={styles.rightBlock}>
            <Text style={styles.total}>{formatPrice(order.total_cents)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColour + '18', borderColor: statusColour + '40' }]}>
              <Text style={[styles.statusText, { color: statusColour }]}>{order.status_label}</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.items} numberOfLines={1}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}{order.items?.length ? ` · ${order.items.map((i) => i.name).slice(0, 2).join(', ')}${itemCount > 2 ? '…' : ''}` : ''}
          </Text>
          <Text style={styles.date}>{formatDateTime(order.created_at)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      {onPress !== undefined ? (
        <Pressable onPress={onPress} accessibilityLabel={`View order ${order.order_number ?? order.id}`} accessibilityRole="button">
          {inner}
        </Pressable>
      ) : (
        inner
      )}

      {action !== undefined && (
        <View style={[styles.actionRow, isDesktop && styles.actionRowDesktop]}>
          <Pressable
            style={[styles.actionButton, isDesktop && styles.actionButtonDesktop]}
            onPress={handleAction}
            accessibilityLabel={`${action.label} for order ${order.order_number ?? order.id}`}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>{action.label}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
