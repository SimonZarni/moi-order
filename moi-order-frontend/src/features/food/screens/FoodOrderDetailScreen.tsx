import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { FoodOrderItem } from '@/types/models';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useFoodOrderDetailScreen } from '../hooks/useFoodOrderDetailScreen';
import { styles } from './FoodOrderDetailScreen.styles';

const STEPS = [
  { status: FOOD_ORDER_STATUS.Pending,   label: 'Order placed'         },
  { status: FOOD_ORDER_STATUS.Confirmed, label: 'Confirmed by merchant' },
  { status: FOOD_ORDER_STATUS.Ready,     label: 'Ready for pickup'      },
  { status: FOOD_ORDER_STATUS.Completed, label: 'Completed'             },
] as const;

const STATUS_ORDER = [
  FOOD_ORDER_STATUS.Pending,
  FOOD_ORDER_STATUS.Confirmed,
  FOOD_ORDER_STATUS.Ready,
  FOOD_ORDER_STATUS.Completed,
];

export function FoodOrderDetailScreen(): React.JSX.Element {
  const { order, isLoading, isError, handleBack, handleLinePayPress } = useFoodOrderDetailScreen();

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

  const isCancelled = order.status === FOOD_ORDER_STATUS.Cancelled;
  const currentIdx  = STATUS_ORDER.indexOf(order.status as typeof STATUS_ORDER[number]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Order #{order.id}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {isCancelled ? (
          <View style={styles.cancelledCard}>
            <Text style={styles.cancelledText}>This order has been cancelled.</Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {STEPS.map((step, i) => {
              const isDone   = currentIdx > i;
              const isActive = currentIdx === i;
              const isLast   = i === STEPS.length - 1;
              return (
                <View key={step.status}>
                  <View style={styles.timelineRow}>
                    <View style={[styles.timelineDot, isDone && styles.timelineDotDone, isActive && styles.timelineDotActive]} />
                    <Text style={[styles.timelineLabel, isActive && styles.timelineLabelActive]}>{step.label}</Text>
                  </View>
                  {!isLast && <View style={[styles.timelineLine, (isDone || isActive) && styles.timelineLineActive]} />}
                </View>
              );
            })}
          </View>
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

        {order.can_show_line_pay_btn && (
          <Pressable style={styles.linePayBtn} onPress={handleLinePayPress} accessibilityRole="button" accessibilityLabel="Pay via LINE Pay">
            <Text style={styles.linePayText}>💚 Pay via LINE Pay</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
