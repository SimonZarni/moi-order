import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_PAYMENT_METHOD, FoodPaymentMethod } from '@/types/enums';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { UserAddress } from '@/types/models';
import { useCheckoutScreen } from '../hooks/useCheckoutScreen';
import { styles } from './CheckoutScreen.styles';

const LABEL_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  home:  'home-outline',
  work:  'briefcase-outline',
  other: 'location-outline',
};

const LINE_GREEN = '#00B900';

const PAYMENT_OPTIONS: Array<{ value: FoodPaymentMethod; label: string; iconName: string; iconColor?: string }> = [
  { value: FOOD_PAYMENT_METHOD.Cod,       label: 'Cash on Delivery',  iconName: 'cash-outline' },
  { value: FOOD_PAYMENT_METHOD.LinePay, label: 'LINE Pay', iconName: 'chatbubble-ellipses', iconColor: LINE_GREEN },
];

function AddressSection({ address, onPress }: { address: UserAddress | null; onPress: () => void }): React.JSX.Element {
  if (address === null) {
    return (
      <Pressable style={styles.addressEmpty} onPress={onPress} accessibilityRole="button" accessibilityLabel="Add delivery address">
        <Ionicons name="location-outline" size={20} color={colours.textMuted} />
        <Text style={styles.addressEmptyText}>Tap to add delivery address</Text>
        <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
      </Pressable>
    );
  }

  const icon = LABEL_ICON[address.label] ?? 'location-outline';
  const lines = [address.building, address.floor, address.landmark].filter(Boolean);

  return (
    <Pressable style={styles.addressCard} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Change delivery address — ${address.address}`}>
      <View style={styles.addressIconWrap}>
        <Ionicons name={icon} size={18} color={colours.primary} />
      </View>
      <View style={styles.addressBody}>
        <View style={styles.addressTopRow}>
          <View style={styles.addressLabelChip}>
            <Text style={styles.addressLabelText}>{address.label_display.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.addressText} numberOfLines={2}>{address.address}</Text>
        {lines.length > 0 && (
          <Text style={styles.addressSecondary} numberOfLines={1}>{lines.join(', ')}</Text>
        )}
      </View>
      <Text style={styles.changeBtn}>Change</Text>
    </Pressable>
  );
}

export function CheckoutScreen(): React.JSX.Element {
  const {
    items, restaurantName, subtotalCents,
    paymentMethod, notes, selectedAddress, isPlacing,
    setPaymentMethod, setNotes,
    handleIncrement, handleDecrement,
    handleBack, handleChangeAddress, handlePlaceOrder,
  } = useCheckoutScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Order from {restaurantName}</Text>

        <View style={styles.card}>
          {items.map((item) => (
            <View key={item.cartKey} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                {item.selectedOptions.length > 0 && (
                  <Text style={styles.itemOptions} numberOfLines={2}>
                    {item.selectedOptions.map((o) => o.optionName).join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.qtyControls}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => handleDecrement(item.cartKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove one ${item.name}`}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <Pressable
                  style={[styles.qtyBtn, styles.qtyBtnActive]}
                  onPress={() => handleIncrement(item.cartKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add one more ${item.name}`}
                >
                  <Text style={[styles.qtyBtnText, styles.qtyBtnTextActive]}>+</Text>
                </Pressable>
              </View>
              <Text style={styles.itemPrice}>
                {formatPrice(((item.basePriceCents + item.additionalPriceCents) * item.quantity) / 100)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(subtotalCents / 100)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <AddressSection address={selectedAddress} onPress={handleChangeAddress} />

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
              <Ionicons
                name={opt.iconName as React.ComponentProps<typeof Ionicons>['name']}
                size={22}
                color={opt.iconColor ?? colours.textMuted}
              />
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
          style={[
            styles.placeBtn,
            paymentMethod === FOOD_PAYMENT_METHOD.LinePay && styles.placeBtnLine,
            isPlacing && styles.placeBtnDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isPlacing || items.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Place order"
        >
          {isPlacing ? (
            <Text style={styles.placeBtnText}>Placing order…</Text>
          ) : paymentMethod === FOOD_PAYMENT_METHOD.LinePay ? (
            <View style={styles.placeBtnRow}>
              <Ionicons name="chatbubble-ellipses" size={18} color={colours.white} />
              <Text style={styles.placeBtnText}>Place Order & Pay via LINE</Text>
            </View>
          ) : (
            <Text style={styles.placeBtnText}>Place Order</Text>
          )}
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
