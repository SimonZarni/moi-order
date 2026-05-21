import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './OrderCard.styles';
import { colours } from '../../../shared/theme/colours';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { ORDER_STATUS } from '../../../types/enums';
import type { FoodOrder } from '../../../types/models';

interface OrderAction {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  nextStatus: string;
}

const ORDER_ACTIONS: Partial<Record<string, OrderAction>> = {
  [ORDER_STATUS.OrderPlaced]:          { label: 'Accept Order',   icon: 'checkmark-circle-outline', nextStatus: ORDER_STATUS.WaitingForPayment },
  [ORDER_STATUS.PaymentConfirmed]:     { label: 'Start Preparing',icon: 'flame-outline',             nextStatus: ORDER_STATUS.PreparingFood },
  [ORDER_STATUS.PreparingFood]:        { label: 'Mark Ready',     icon: 'bag-check-outline',         nextStatus: ORDER_STATUS.WaitingForDelivery },
  [ORDER_STATUS.WaitingForDelivery]:   { label: 'Rider Picked Up',icon: 'bicycle-outline',           nextStatus: ORDER_STATUS.DeliveryOnTheWay },
  [ORDER_STATUS.DeliveryOnTheWay]:     { label: 'Mark Delivered', icon: 'location-outline',          nextStatus: ORDER_STATUS.Delivered },
  [ORDER_STATUS.Delivered]:            { label: 'Complete Order', icon: 'checkmark-done-outline',    nextStatus: ORDER_STATUS.Completed },
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
  const initials = (order.user.name ?? '?').slice(0, 2).toUpperCase();
  const itemNames = order.items?.slice(0, 2).map((i) => i.name).join(', ') ?? '';
  const extraItems = (order.items?.length ?? 0) - 2;

  const handleAction = useCallback(() => {
    if (action) onUpdateStatus(order.id, action.nextStatus);
  }, [action, order.id, onUpdateStatus]);

  const content = (
    <View style={styles.inner}>
      {/* 6px status colour strip */}
      <View style={[styles.strip, { backgroundColor: statusColour }]} />

      <View style={styles.content}>
        {/* Row 1: avatar + name/order# + amount */}
        <View style={styles.row1}>
          <View style={[styles.avatar, { backgroundColor: statusColour + '20' }]}>
            <Text style={[styles.avatarText, { color: statusColour }]}>{initials}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.customerName}>{order.user.name}</Text>
            <Text style={styles.orderNum}>{order.order_number ?? `#${order.id}`}</Text>
          </View>
          <Text style={styles.amount}>{formatPrice(order.total_cents)}</Text>
        </View>

        {/* Row 2: items + status badge */}
        <View style={styles.row2}>
          <Text style={styles.items} numberOfLines={1}>
            {itemNames}{extraItems > 0 ? ` +${extraItems} more` : ''}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColour + '18', borderColor: statusColour + '44' }]}>
            <Text style={[styles.statusText, { color: statusColour }]}>{order.status_label}</Text>
          </View>
        </View>

        {/* Row 3: time */}
        <Text style={styles.time}>{formatDateTime(order.created_at)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      {onPress !== undefined ? (
        <Pressable onPress={onPress} accessibilityLabel={`View order ${order.order_number ?? order.id}`} accessibilityRole="button">
          {content}
        </Pressable>
      ) : (
        content
      )}

      {action !== undefined && (
        <View style={[styles.actionWrap, isDesktop && styles.actionWrapDesktop]}>
          <Pressable
            style={[styles.actionBtn, isDesktop && styles.actionBtnDesktop, { shadowColor: statusColour }]}
            onPress={handleAction}
            accessibilityLabel={`${action.label} for order ${order.order_number ?? order.id}`}
            accessibilityRole="button"
          >
            <Ionicons name={action.icon} size={15} color={colours.white} />
            <Text style={styles.actionBtnText}>{action.label}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
