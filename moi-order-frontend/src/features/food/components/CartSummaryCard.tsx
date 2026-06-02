import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { CartItem } from '@/shared/store/cartStore';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './CartSummaryCard.styles';

interface Props {
  items:          CartItem[];
  restaurantName: string;
  totalCents:     number;
  onCheckout:     () => void;
  onClear:        () => void;
}

export function CartSummaryCard({ items, restaurantName, totalCents, onCheckout, onClear }: Props): React.JSX.Element {
  if (items.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Ionicons name="cart-outline" size={36} color={colours.textMuted} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View>
      {restaurantName.length > 0 && (
        <Text style={styles.restaurantName}>{restaurantName}</Text>
      )}
      <View style={styles.card}>
        {items.map((item: CartItem) => (
          <View key={item.cartKey} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.itemQty}>×{item.quantity}</Text>
            <Text style={styles.itemPrice}>
              {formatPrice(((item.basePriceCents + item.additionalPriceCents) * item.quantity) / 100)}
            </Text>
          </View>
        ))}
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>{formatPrice(totalCents / 100)}</Text>
        </View>
      </View>
      <Pressable style={styles.checkoutBtn} onPress={onCheckout} accessibilityRole="button" accessibilityLabel="Proceed to checkout">
        <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
      </Pressable>
      <Pressable style={styles.clearBtn} onPress={onClear} accessibilityRole="button" accessibilityLabel="Clear cart">
        <Text style={styles.clearBtnText}>Clear Cart</Text>
      </Pressable>
    </View>
  );
}
