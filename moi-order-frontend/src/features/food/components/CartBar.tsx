import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './CartBar.styles';

interface Props {
  itemCount: number;
  totalCents: number;
  onPress: () => void;
  orderCount?: number;
  onOrdersPress?: () => void;
}

export function CartBar({ itemCount, totalCents, onPress, orderCount = 0, onOrdersPress }: Props): React.JSX.Element | null {
  if (itemCount === 0) return null;

  const hasOrders = orderCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onOrdersPress !== undefined && (
          <Pressable
            style={styles.ordersBtn}
            onPress={onOrdersPress}
            accessibilityRole="button"
            accessibilityLabel={hasOrders ? `View orders, ${orderCount} active` : 'View orders'}
          >
            {hasOrders && (
              <View style={styles.badge}>
                <Text style={styles.badgeTextDark}>{orderCount > 9 ? '9+' : orderCount}</Text>
              </View>
            )}
            <Ionicons name="receipt-outline" size={16} color={colours.textOnDark} style={styles.ordersIcon} />
            <Text style={styles.ordersLabel}>Orders</Text>
          </Pressable>
        )}
        <Pressable
          style={styles.btn}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`View cart, ${itemCount} items, total ${formatPrice(totalCents / 100)}`}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
          </View>
          <Text style={styles.label}>View Cart</Text>
          <Text style={styles.total}>{formatPrice(totalCents / 100)}</Text>
        </Pressable>
      </View>
    </View>
  );
}
