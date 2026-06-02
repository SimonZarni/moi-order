import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FoodOrder } from '@/types/models';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { CartSummaryCard } from '../components/CartSummaryCard';
import { FoodOrderCard } from '../components/FoodOrderCard';
import { useCartAndOrdersScreen } from '../hooks/useCartAndOrdersScreen';
import { styles } from './CartAndOrdersScreen.styles';

export function CartAndOrdersScreen(): React.JSX.Element {
  const {
    cartItems, restaurantName, cartTotalCents,
    orders, isOrdersLoading, isOrdersError,
    handleCheckout, handleClearCart,
    handleOrderPress, handleBack,
  } = useCartAndOrdersScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Cart & Orders</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>YOUR CART</Text>
        <CartSummaryCard
          items={cartItems}
          restaurantName={restaurantName}
          totalCents={cartTotalCents}
          onCheckout={handleCheckout}
          onClear={handleClearCart}
        />

        <Text style={[styles.sectionLabel, styles.ordersSectionLabel]}>YOUR ORDERS</Text>
        {isOrdersLoading && <ActivityIndicator color={colours.primary} style={styles.loader} />}
        {isOrdersError && <Text style={styles.errorText}>Could not load orders.</Text>}
        {!isOrdersLoading && !isOrdersError && orders.length === 0 && (
          <View style={styles.emptyOrders}>
            <Ionicons name="receipt-outline" size={36} color={colours.textMuted} />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        )}
        {orders.map((order: FoodOrder) => (
          <FoodOrderCard key={order.id} order={order} onPress={handleOrderPress} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
