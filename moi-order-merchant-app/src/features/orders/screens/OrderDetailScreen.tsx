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

interface OrderAction {
  label: string;
  nextStatus: string;
}

const ORDER_ACTIONS: Partial<Record<string, OrderAction>> = {
  [ORDER_STATUS.PaymentConfirmed]: { label: 'Start Preparing', nextStatus: ORDER_STATUS.PreparingFood },
  [ORDER_STATUS.PreparingFood]: { label: 'Ready for Pickup / Delivery', nextStatus: ORDER_STATUS.WaitingForDelivery },
  [ORDER_STATUS.WaitingForDelivery]: { label: 'Mark Picked Up', nextStatus: ORDER_STATUS.DeliveryOnTheWay },
  [ORDER_STATUS.DeliveryOnTheWay]: { label: 'Mark Delivered', nextStatus: ORDER_STATUS.Delivered },
};

const STATUS_COLOURS: Record<string, string> = {
  [ORDER_STATUS.OrderPlaced]: colours.warning,
  [ORDER_STATUS.WaitingForPayment]: colours.warning,
  [ORDER_STATUS.PaymentConfirmed]: colours.primary,
  [ORDER_STATUS.PreparingFood]: colours.primary,
  [ORDER_STATUS.WaitingForDelivery]: colours.primaryDark,
  [ORDER_STATUS.DeliveryOnTheWay]: colours.primaryDark,
  [ORDER_STATUS.Delivered]: colours.success,
  [ORDER_STATUS.Completed]: colours.success,
  [ORDER_STATUS.Cancelled]: colours.error,
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
          <Pressable
            style={{ marginTop: 4 }}
            onPress={onBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={{ color: colours.primary, fontWeight: '600' }}>← Go back</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const action = ORDER_ACTIONS[order.status];
  const statusColour = STATUS_COLOURS[order.status] ?? colours.medium;
  const canCancel = order.status === ORDER_STATUS.OrderPlaced || order.status === ORDER_STATUS.PaymentConfirmed;

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
                  <Text style={[styles.value, { color: colours.primary }]}>{order.user.phone}</Text>
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

        {action !== undefined && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              (isUpdating || pressed) && styles.actionButtonDisabled,
            ]}
            onPress={() => handleUpdateStatus(action.nextStatus)}
            disabled={isUpdating}
            accessibilityLabel={action.label}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>
              {isUpdating ? 'Updating…' : action.label}
            </Text>
          </Pressable>
        )}

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
