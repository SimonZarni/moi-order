import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderCard } from '../../orders/components/OrderCard';
import { styles } from './OrdersSection.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { FoodOrder } from '../../../types/models';

interface OrdersSectionProps {
  recentOrders: FoodOrder[];
  pendingOnly: boolean;
  onUpdateStatus: (orderId: string, status: string) => void;
  onSelectOrder?: (orderId: string) => void;
  onTogglePending: () => void;
}

export function OrdersSection({ recentOrders, pendingOnly, onUpdateStatus, onSelectOrder, onTogglePending }: OrdersSectionProps): React.JSX.Element {
  const t = useTranslation();
  const title = pendingOnly ? t('dashboard_pending_orders') : t('dashboard_recent_orders');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.liveIndicator} />
          <Text style={styles.title}>{title}</Text>
          {recentOrders.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{recentOrders.length}</Text>
            </View>
          )}
        </View>
        <Pressable
          style={[styles.filterChip, pendingOnly && styles.filterChipActive]}
          onPress={onTogglePending}
          accessibilityRole="button"
          accessibilityLabel={pendingOnly ? 'Show all orders' : 'Show pending only'}
        >
          <Text style={[styles.filterChipText, pendingOnly && styles.filterChipTextActive]}>
            {pendingOnly ? 'All' : 'Pending'}
          </Text>
        </Pressable>
      </View>

      {recentOrders.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={28} color={colours.textSubtle} />
          <Text style={styles.emptyText}>{t('dashboard_no_recent_orders')}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              variant="light"
              onUpdateStatus={onUpdateStatus}
              onStartPreparing={onSelectOrder !== undefined ? () => onSelectOrder(order.id) : () => {}}
              onPress={onSelectOrder !== undefined ? () => onSelectOrder(order.id) : undefined}
            />
          ))}
        </View>
      )}
    </View>
  );
}
