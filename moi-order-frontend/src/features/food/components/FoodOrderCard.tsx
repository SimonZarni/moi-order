import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { colours } from '@/shared/theme/colours';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './FoodOrderCard.styles';

interface Props {
  order: FoodOrder;
  onPress: (order: FoodOrder) => void;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  [FOOD_ORDER_STATUS.OrderPlaced]:        { bg: '#fef9c3', color: '#92400e', label: 'Order Placed'          },
  [FOOD_ORDER_STATUS.WaitingForPayment]:  { bg: '#ffedd5', color: '#c2410c', label: 'Awaiting Payment'      },
  [FOOD_ORDER_STATUS.PaymentConfirmed]:   { bg: '#dbeafe', color: '#1d4ed8', label: 'Payment Confirmed'     },
  [FOOD_ORDER_STATUS.PreparingFood]:      { bg: '#ede9fe', color: '#6d28d9', label: 'Preparing'             },
  [FOOD_ORDER_STATUS.WaitingForDelivery]: { bg: '#ccfbf1', color: '#0f766e', label: 'Waiting for Delivery'  },
  [FOOD_ORDER_STATUS.DeliveryOnTheWay]:   { bg: '#e0f2fe', color: '#0369a1', label: 'On the Way'            },
  [FOOD_ORDER_STATUS.Delivered]:          { bg: '#dcfce7', color: '#15803d', label: 'Delivered'             },
  [FOOD_ORDER_STATUS.Completed]:          { bg: '#f0fdf4', color: '#166534', label: 'Completed'             },
  [FOOD_ORDER_STATUS.Cancelled]:          { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled'             },
  [FOOD_ORDER_STATUS.Expired]:            { bg: '#f3f4f6', color: '#4b5563', label: 'Expired'               },
};

const FALLBACK_STYLE: { bg: string; color: string; label: string } = {
  bg: '#fef9c3', color: '#a16207', label: 'Order Placed',
};

export function FoodOrderCard({ order, onPress }: Props): React.JSX.Element {
  const badge: { bg: string; color: string; label: string } = STATUS_STYLE[order.status] ?? FALLBACK_STYLE;

  const itemsSummary = order.items
    ? order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')
    : `${order.restaurant_name ?? 'Restaurant'}`;

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(order)}
      accessibilityRole="button"
      accessibilityLabel={`Order from ${order.restaurant_name}, ${badge.label}`}
    >
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {order.restaurant_name ?? 'Restaurant'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>
        <Text style={styles.itemsSummary} numberOfLines={2}>{itemsSummary}</Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(order.created_at)}</Text>
          <Text style={styles.total}>{formatPrice(order.total_cents / 100)}</Text>
        </View>
      </View>
    </Pressable>
  );
}
