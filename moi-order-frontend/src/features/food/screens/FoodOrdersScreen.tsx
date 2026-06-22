import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { formatDateTime } from '@/shared/utils/formatDate';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { useFoodOrdersScreen } from '../hooks/useFoodOrdersScreen';
import { ORDER_STATUS_COLOURS, styles } from './FoodOrdersScreen.styles';

export function FoodOrdersScreen(): React.JSX.Element {
  const {
    orders, isOrdersLoading, isOrdersError,
    isSelecting, selectedIds, isDeletingOrders,
    handleOrderPress, handleBack,
    handleEnterSelect, handleCancelSelect,
    handleDeleteSelected,
  } = useFoodOrdersScreen();

  const hasCancelled = orders.some((o) => o.status === FOOD_ORDER_STATUS.Cancelled);
  const selectedCount = selectedIds.size;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        {isSelecting ? (
          <>
            <Pressable onPress={handleCancelSelect} style={styles.selectActionBtn} accessibilityRole="button" accessibilityLabel="Cancel selection">
              <Text style={styles.selectActionText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{selectedCount > 0 ? `${selectedCount} selected` : 'Select Orders'}</Text>
            <Pressable
              onPress={handleDeleteSelected}
              style={[styles.deleteBtn, (selectedCount === 0 || isDeletingOrders) && styles.deleteBtnDisabled]}
              disabled={selectedCount === 0 || isDeletingOrders}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${selectedCount} orders`}
            >
              <Text style={styles.deleteBtnText}>{isDeletingOrders ? '…' : `Delete (${selectedCount})`}</Text>
            </Pressable>
          </>
        ) : (
          <>
            <BackButton onPress={handleBack} />
            <Text style={styles.headerTitle}>My Orders</Text>
            {hasCancelled && (
              <Pressable onPress={handleEnterSelect} style={styles.selectActionBtn} accessibilityRole="button" accessibilityLabel="Select orders to delete">
                <Text style={styles.selectActionText}>Select</Text>
              </Pressable>
            )}
          </>
        )}
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
              const statusColour  = ORDER_STATUS_COLOURS[order.status] ?? { bg: colours.infoBg, text: colours.textMuted };
              const isCancelled   = order.status === FOOD_ORDER_STATUS.Cancelled;
              const isSelectable  = isSelecting && isCancelled;
              const isSelected    = selectedIds.has(order.id);
              const isDimmed      = isSelecting && !isCancelled;

              return (
                <Pressable
                  key={order.id}
                  style={[styles.orderRow, isSelected && styles.orderRowSelected, isDimmed && styles.orderRowDimmed]}
                  onPress={() => handleOrderPress(order)}
                  accessibilityRole="button"
                  accessibilityLabel={`${isSelectable ? (isSelected ? 'Deselect' : 'Select') : 'View'} order ${order.order_number ?? order.id}`}
                >
                  {isSelecting && (
                    <View style={[styles.checkbox, isSelectable && styles.checkboxActive, isSelected && styles.checkboxChecked]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color={colours.backgroundDark} />}
                    </View>
                  )}
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderNumber}>
                      {order.order_number != null ? order.order_number : `#${order.id}`}
                    </Text>
                    {order.restaurant_name != null && (
                      <Text style={styles.orderRestaurant} numberOfLines={1}>{order.restaurant_name}</Text>
                    )}
                    {order.items != null && order.items.length > 0 && (
                      <Text style={styles.orderItems} numberOfLines={1}>
                        {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </Text>
                    )}
                    <Text style={styles.orderDate}>{formatDateTime(order.created_at)}</Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderTotal}>{formatPrice(order.total_cents / 100)}</Text>
                    <View style={[styles.orderStatusBadge, { backgroundColor: statusColour.bg }]}>
                      <Text style={[styles.orderStatusText, { color: statusColour.text }]}>{order.status_label}</Text>
                    </View>
                  </View>
                  {!isSelecting && <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
