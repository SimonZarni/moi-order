import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { CartItem } from '@/shared/store/cartStore';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { useCartScreen } from '../hooks/useCartScreen';
import { styles } from './CartScreen.styles';

export function CartScreen(): React.JSX.Element {
  const {
    cartItems, restaurantName, cartTotalCents,
    handleCheckout, handleClearCart, handleBack,
  } = useCartScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cart-outline" size={48} color={colours.textMuted} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Your Cart</Text>
            {restaurantName.length > 0 && (
              <Text style={styles.cartRestaurant}>{restaurantName}</Text>
            )}
            <View style={styles.card}>
              {cartItems.map((item: CartItem) => (
                <View key={item.cartKey} style={styles.cartItemRow}>
                  <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cartItemQty}>×{item.quantity}</Text>
                  <Text style={styles.cartItemPrice}>
                    {formatPrice(((item.basePriceCents + item.additionalPriceCents) * item.quantity) / 100)}
                  </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
