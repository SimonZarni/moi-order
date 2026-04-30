import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './FoodOrderCard.styles';

interface Props {
  order: FoodOrder;
  onPress: (order: FoodOrder) => void;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  [FOOD_ORDER_STATUS.Pending]:   { bg: '#fef9c3', color: '#a16207', label: 'Pending'   },
  [FOOD_ORDER_STATUS.Confirmed]: { bg: '#dbeafe', color: '#1d4ed8', label: 'Confirmed' },
  [FOOD_ORDER_STATUS.Ready]:     { bg: '#d1fae5', color: '#065f46', label: 'Ready'     },
  [FOOD_ORDER_STATUS.Completed]: { bg: colours.infoBg, color: colours.medium, label: 'Completed' },
  [FOOD_ORDER_STATUS.Cancelled]: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
};

import { colours } from '@/shared/theme/colours';

export function FoodOrderCard({ order, onPress }: Props): React.JSX.Element {
  const badge = STATUS_STYLE[order.status] ?? STATUS_STYLE[FOOD_ORDER_STATUS.Pending];

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
