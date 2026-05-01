import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { FoodOrderItem } from '@/types/models';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { OrderProgressBar } from '../components/OrderProgressBar';
import { useFoodOrderDetailScreen } from '../hooks/useFoodOrderDetailScreen';
import { styles } from './FoodOrderDetailScreen.styles';

export function FoodOrderDetailScreen(): React.JSX.Element {
  const { order, isLoading, handleBack, handlePromptPayPress } = useFoodOrderDetailScreen();

  if (isLoading || !order) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Order</Text>
        </View>
        <View style={styles.stateBox}><ActivityIndicator color={colours.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Order #{order.id}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {order.status === FOOD_ORDER_STATUS.Cancelled ? (
          <View style={styles.cancelledCard}>
            <Text style={styles.cancelledText}>This order has been cancelled.</Text>
          </View>
        ) : (
          <OrderProgressBar
            status={order.status}
            canShowPromptPay={order.can_show_prompt_pay}
            onPromptPayPress={handlePromptPayPress}
          />
        )}
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {(order.items ?? []).map((item: FoodOrderItem) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemQty}>×{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.subtotal_cents / 100)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total_cents / 100)}</Text>
          </View>
        </View>
        {order.customer_notes !== null && (
          <>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}><Text style={styles.notesText}>{order.customer_notes}</Text></View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
