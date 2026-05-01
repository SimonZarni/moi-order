import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FoodOrder } from '@/types/models';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import { CartItem } from '@/shared/store/cartStore';
import { useCartOrdersScreen } from '../hooks/useCartOrdersScreen';
import { ORDER_STATUS_COLOURS, styles } from './CartOrdersScreen.styles';

export function CartOrdersScreen(): React.JSX.Element {
  const {
    cartItems, restaurantName, cartTotalCents,
    handleCheckout, handleClearCart,
    orders, isOrdersLoading, isOrdersError,
    handleOrderPress, handleBack,
  } = useCartOrdersScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Cart & Orders</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Your Cart</Text>
            {restaurantName.length > 0 && (
              <Text style={styles.cartRestaurant}>{restaurantName}</Text>
            )}
            <View style={styles.card}>
              {cartItems.map((item: CartItem) => (
                <View key={item.menuItemId} style={styles.cartItemRow}>
                  <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cartItemQty}>×{item.quantity}</Text>
                  <Text style={styles.cartItemPrice}>{formatPrice((item.priceCents * item.quantity) / 100)}</Text>
                </View>
              ))}
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalValue}>{formatPrice(cartTotalCents / 100)}</Text>
              </View>
            </View>
            <Pressable style={styles.checkoutBtn} onPress={handleCheckout} accessibilityRole="button" accessibilityLabel="Proceed to checkout">
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </Pressable>
            <Pressable style={styles.clearBtn} onPress={handleClearCart} accessibilityRole="button" accessibilityLabel="Clear cart">
              <Text style={styles.clearBtnText}>Clear Cart</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.sectionLabel}>Recent Orders</Text>

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
            <Text style={styles.stateText}>No orders yet</Text>
          </View>
        )}
        {!isOrdersLoading && (
          <View style={styles.card}>
            {orders.map((order: FoodOrder) => {
              const statusColour = ORDER_STATUS_COLOURS[order.status] ?? { bg: colours.infoBg, text: colours.textMuted };
              return (
                <Pressable key={order.id} style={styles.orderRow} onPress={() => handleOrderPress(order)} accessibilityRole="button" accessibilityLabel={`View order ${order.order_number ?? order.id}`}>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderNumber}>
                      {order.order_number != null ? order.order_number : `#${order.id}`}
                    </Text>
                    {order.restaurant_name != null && (
                      <Text style={styles.orderRestaurant} numberOfLines={1}>{order.restaurant_name}</Text>
                    )}
                    <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
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
