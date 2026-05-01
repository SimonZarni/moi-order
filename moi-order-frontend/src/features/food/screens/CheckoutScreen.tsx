import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_PAYMENT_METHOD, FoodPaymentMethod } from '@/types/enums';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useCheckoutScreen } from '../hooks/useCheckoutScreen';
import { styles } from './CheckoutScreen.styles';

const PAYMENT_OPTIONS: Array<{ value: FoodPaymentMethod; label: string; icon: string }> = [
  { value: FOOD_PAYMENT_METHOD.Cod,       label: 'Cash on Delivery', icon: '💵' },
  { value: FOOD_PAYMENT_METHOD.PromptPay, label: 'PromptPay',        icon: '🔵' },
];

export function CheckoutScreen(): React.JSX.Element {
  const {
    items, restaurantName, subtotalCents,
    paymentMethod, notes, isPlacing,
    setPaymentMethod, setNotes, handleBack, handlePlaceOrder,
  } = useCheckoutScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Order from {restaurantName}</Text>

        <View style={styles.card}>
          {items.map((item) => (
            <View key={item.menuItemId} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemQty}>×{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatPrice((item.priceCents * item.quantity) / 100)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(subtotalCents / 100)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          {PAYMENT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={styles.paymentOption}
              onPress={() => setPaymentMethod(opt.value)}
              accessibilityRole="radio"
              accessibilityLabel={opt.label}
              accessibilityState={{ checked: paymentMethod === opt.value }}
            >
              <Text>{opt.icon}</Text>
              <Text style={styles.paymentLabel}>{opt.label}</Text>
              <View style={styles.radioOuter}>
                {paymentMethod === opt.value && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Notes for restaurant</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special requests or allergies…"
          placeholderTextColor={colours.textMuted}
          multiline
          maxLength={500}
          accessibilityLabel="Order notes"
        />

        <Pressable
          style={[styles.placeBtn, isPlacing && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacing || items.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Place order"
        >
          <Text style={styles.placeBtnText}>{isPlacing ? 'Placing order…' : 'Place Order'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
