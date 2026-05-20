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

// Every merchant-triggered forward transition in the correct order.
const ORDER_ACTIONS: Partial<Record<string, OrderAction>> = {
  [ORDER_STATUS.OrderPlaced]:          { label: 'Accept Order',    nextStatus: ORDER_STATUS.WaitingForPayment },
  [ORDER_STATUS.PaymentConfirmed]:     { label: 'Start Preparing', nextStatus: ORDER_STATUS.PreparingFood },
  [ORDER_STATUS.PreparingFood]:        { label: 'Mark Ready',      nextStatus: ORDER_STATUS.WaitingForDelivery },
  [ORDER_STATUS.WaitingForDelivery]:   { label: 'Mark Picked Up',  nextStatus: ORDER_STATUS.DeliveryOnTheWay },
  [ORDER_STATUS.DeliveryOnTheWay]:     { label: 'Mark Delivered',  nextStatus: ORDER_STATUS.Delivered },
  [ORDER_STATUS.Delivered]:            { label: 'Complete Order',   nextStatus: ORDER_STATUS.Completed },
  // WaitingForPayment: customer pays via LINE — no merchant action button needed
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
  const itemsSummary = order.items?.map((i) => `${i.quantity}× ${i.name}`).join(', ') ?? '';

  const handleAction = useCallback(() => {
    if (action) onUpdateStatus(order.id, action.nextStatus);
  }, [action, order.id, onUpdateStatus]);

  // Unified badge style: coloured bg (18%) + coloured border (40%)
  const badgeStyle = {
    backgroundColor: statusColour + '18',
    borderColor: statusColour + '40',
  };

  const cardInfo = (
    <>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.order_number ?? `#${order.id}`}</Text>
        <View style={[styles.statusBadge, badgeStyle]}>
          <Text style={[styles.statusText, { color: statusColour }]}>{order.status_label}</Text>
        </View>
      </View>
      <Text style={styles.customer}>{order.user.name}</Text>
      {order.user.phone !== null && (
        <Text style={styles.meta}>{order.user.phone}</Text>
      )}
      <Text style={styles.items} numberOfLines={2}>{itemsSummary}</Text>
      <View style={styles.footer}>
        <Text style={styles.total}>{formatPrice(order.total_cents)}</Text>
        <Text style={styles.date}>{formatDateTime(order.created_at)}</Text>
      </View>
    </>
  );

  return (
    // Outer View — never a Pressable, so the action button inside is never a nested <button>
    <View style={styles.card}>
      {onPress !== undefined ? (
        <Pressable
          style={styles.cardContent}
          onPress={onPress}
          accessibilityLabel={`View order ${order.order_number ?? order.id}`}
          accessibilityRole="button"
        >
          {cardInfo}
        </Pressable>
      ) : (
        <View style={styles.cardContent}>{cardInfo}</View>
      )}

      {/* Action button is always a sibling, never nested inside another Pressable */}
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
