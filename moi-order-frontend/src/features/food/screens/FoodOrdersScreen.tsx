import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FoodOrder } from '@/types/models';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { formatDateTime } from '@/shared/utils/formatDate';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { useFoodOrdersScreen } from '../hooks/useFoodOrdersScreen';
import { ORDER_STATUS_COLOURS, styles } from './FoodOrdersScreen.styles';

export function FoodOrdersScreen(): React.JSX.Element {
  const {
    orders, isOrdersLoading, isOrdersError,
    handleOrderPress, handleBack,
  } = useFoodOrdersScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isOrdersLoading && (
          <View style={styles.stateBox}>
            <ActivityIndicator color={colours.primary} />
          </View>
        )}
        {isOrdersError && (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>Could not load orders.</Text>
          </View>
        )}
        {!isOrdersLoading && !isOrdersError && orders.length === 0 && (
          <View style={styles.stateBox}>
            <Ionicons name="receipt-outline" size={48} color={colours.textMuted} />
            <Text style={styles.stateText}>No orders yet</Text>
          </View>
        )}
        {!isOrdersLoading && orders.length > 0 && (
          <View style={styles.card}>
            {orders.map((order: FoodOrder) => {
              const statusColour = ORDER_STATUS_COLOURS[order.status] ?? { bg: colours.infoBg, text: colours.textMuted };
              return (
                <Pressable
                  key={order.id}
                  style={styles.orderRow}
                  onPress={() => handleOrderPress(order)}
                  accessibilityRole="button"
                  accessibilityLabel={`View order ${order.order_number ?? order.id}`}
                >
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderNumber}>
                      {order.order_number != null ? order.order_number : `#${order.id}`}
                    </Text>
                    {order.restaurant_name != null && (
                      <Text style={styles.orderRestaurant} numberOfLines={1}>{order.restaurant_name}</Text>
                    )}
                    <Text style={styles.orderDate}>{formatDateTime(order.created_at)}</Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderTotal}>{formatPrice(order.total_cents / 100)}</Text>
                    <View style={[styles.orderStatusBadge, { backgroundColor: statusColour.bg }]}>
                      <Text style={[styles.orderStatusText, { color: statusColour.text }]}>{order.status_label}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
