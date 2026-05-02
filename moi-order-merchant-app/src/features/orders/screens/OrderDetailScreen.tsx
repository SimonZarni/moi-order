import React from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrderDetailScreen } from '../hooks/useOrderDetailScreen';
import { styles } from './OrderDetailScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { ORDER_STATUS } from '../../../types/enums';

// Every merchant-triggered forward transition in the correct order.
const ORDER_ACTIONS: Partial<Record<string, string>> = {
  [ORDER_STATUS.OrderPlaced]:        ORDER_STATUS.WaitingForPayment,
  [ORDER_STATUS.PaymentConfirmed]:   ORDER_STATUS.PreparingFood,
  [ORDER_STATUS.PreparingFood]:      ORDER_STATUS.WaitingForDelivery,
  [ORDER_STATUS.WaitingForDelivery]: ORDER_STATUS.DeliveryOnTheWay,
  [ORDER_STATUS.DeliveryOnTheWay]:   ORDER_STATUS.Delivered,
  [ORDER_STATUS.Delivered]:          ORDER_STATUS.Completed,
};

const ACTION_LABELS: Partial<Record<string, string>> = {
  [ORDER_STATUS.OrderPlaced]:        'Accept Order',
  [ORDER_STATUS.PaymentConfirmed]:   'Start Preparing',
  [ORDER_STATUS.PreparingFood]:      'Mark Ready for Pickup / Delivery',
  [ORDER_STATUS.WaitingForDelivery]: 'Mark Picked Up by Rider',
  [ORDER_STATUS.DeliveryOnTheWay]:   'Mark Delivered',
  [ORDER_STATUS.Delivered]:          'Complete Order',
};

// Cancel is allowed from every state that has at least one other allowed transition.
// Prohibited: delivered (no cancel in enum), completed, cancelled.
const CANCELLABLE_STATUSES = new Set<string>([
  ORDER_STATUS.OrderPlaced,
  ORDER_STATUS.WaitingForPayment,
  ORDER_STATUS.PaymentConfirmed,
  ORDER_STATUS.PreparingFood,
  ORDER_STATUS.WaitingForDelivery,
  ORDER_STATUS.DeliveryOnTheWay,
]);

const STATUS_COLOURS: Record<string, string> = {
  [ORDER_STATUS.OrderPlaced]:        colours.warning,
  [ORDER_STATUS.WaitingForPayment]:  colours.warning,
  [ORDER_STATUS.PaymentConfirmed]:   colours.primary,
  [ORDER_STATUS.PreparingFood]:      colours.primary,
  [ORDER_STATUS.WaitingForDelivery]: colours.primaryDark,
  [ORDER_STATUS.DeliveryOnTheWay]:   colours.primaryDark,
  [ORDER_STATUS.Delivered]:          colours.success,
  [ORDER_STATUS.Completed]:          colours.success,
  [ORDER_STATUS.Cancelled]:          colours.error,
};

// Informational note shown for statuses where the merchant waits on an external actor.
const WAITING_NOTES: Partial<Record<string, string>> = {
  [ORDER_STATUS.WaitingForPayment]: 'Waiting for customer to complete payment.',
};

interface OrderDetailScreenProps {
  orderId: number;
  onBack?: () => void;
}

export function OrderDetailScreen({ orderId, onBack }: OrderDetailScreenProps): React.JSX.Element {
  const { order, isLoading, isError, isUpdating, handleUpdateStatus } = useOrderDetailScreen(orderId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  if (isError || order === undefined) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={44} color={colours.error} />
        <Text style={styles.errorText}>Order could not be loaded</Text>
        {onBack !== undefined && (
          <Pressable onPress={onBack} accessibilityRole="button" style={{ marginTop: 4 }}>
            <Text style={{ color: colours.primary, fontWeight: '600' }}>← Go back</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const nextStatus = ORDER_ACTIONS[order.status];
  const actionLabel = ACTION_LABELS[order.status];
  const waitingNote = WAITING_NOTES[order.status];
  const canCancel = CANCELLABLE_STATUSES.has(order.status);
  const statusColour = STATUS_COLOURS[order.status] ?? colours.medium;

  const handleCallCustomer = (): void => {
    if (order.user.phone !== null) {
      void Linking.openURL(`tel:${order.user.phone}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        {onBack !== undefined && (
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Go back to orders"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={20} color={colours.textOnLight} />
          </Pressable>
        )}
        <Text style={styles.topBarTitle}>
          {order.order_number ?? `Order #${order.id}`}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColour + '20' }]}>
          <Text style={[styles.statusText, { color: statusColour }]}>{order.status_label}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Customer</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{order.user.name}</Text>
            </View>
            {order.user.phone !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>Phone</Text>
                <Pressable onPress={handleCallCustomer} accessibilityRole="link">
                  <Text style={[styles.value, { color: colours.primary }]}>
                    {order.user.phone}
                  </Text>
                </Pressable>
              </View>
            )}
            {order.delivery_address !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{order.delivery_address}</Text>
              </View>
            )}
            {order.customer_notes !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>Notes</Text>
                <Text style={styles.value}>{order.customer_notes}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Details</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Order #</Text>
              <Text style={styles.value}>{order.order_number ?? order.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.value}>{order.payment_method}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Placed</Text>
              <Text style={styles.value}>{formatDateTime(order.created_at)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Items ({order.items.length})</Text>
          </View>
          <View style={styles.cardBody}>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemNameCol}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>× {item.quantity}</Text>
                  {item.notes !== null && (
                    <Text style={styles.itemNotes}>{item.notes}</Text>
                  )}
                </View>
                <Text style={styles.itemPrice}>{formatPrice(item.subtotal_cents)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>{formatPrice(order.subtotal_cents)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(order.total_cents)}</Text>
            </View>
          </View>
        </View>

        {/* Status-specific waiting note */}
        {waitingNote !== undefined && (
          <View style={styles.infoNote}>
            <Ionicons name="time-outline" size={16} color={colours.warning} />
            <Text style={styles.infoNoteText}>{waitingNote}</Text>
          </View>
        )}

        {/* Primary action: advance to next status */}
        {nextStatus !== undefined && actionLabel !== undefined && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              (isUpdating || pressed) && styles.actionButtonDisabled,
            ]}
            onPress={() => handleUpdateStatus(nextStatus)}
            disabled={isUpdating}
            accessibilityLabel={actionLabel}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>
              {isUpdating ? 'Updating…' : actionLabel}
            </Text>
          </Pressable>
        )}

        {/* Cancel — only when the enum permits it */}
        {canCancel && (
          <Pressable
            style={[styles.cancelButton, isUpdating && styles.actionButtonDisabled]}
            onPress={() => handleUpdateStatus(ORDER_STATUS.Cancelled)}
            disabled={isUpdating}
            accessibilityLabel="Cancel this order"
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
