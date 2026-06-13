import React from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, Linking, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOrderDetailScreen } from '../hooks/useOrderDetailScreen';
import { styles } from './OrderDetailScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { ORDER_STATUS } from '../../../types/enums';
import type { MerchantStackParamList } from '../../../types/navigation';

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

const WAITING_NOTES: Partial<Record<string, string>> = {
  [ORDER_STATUS.WaitingForPayment]: 'Waiting for customer to complete payment.',
};

const PAYMENT_LABELS: Record<string, string> = {
  cod:        'Cash on Delivery',
  prompt_pay: 'PromptPay',
  line_pay:   'LINE Pay',
};

const CANCEL_REASONS = [
  { value: 'closing_soon', label: 'Closing soon' },
  { value: 'sold_out',     label: 'Sold out' },
  { value: 'out_of_range', label: 'Delivery address out of range' },
];

interface OrderDetailScreenProps {
  orderId: string;
  onBack?: () => void;
  onChatPress?: (orderId: string, orderNumber: string) => void;
}

export function OrderDetailScreen({ orderId, onBack, onChatPress }: OrderDetailScreenProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();

  const {
    order, isLoading, isError, isUpdating,
    cancelModalVisible, cancelReason, cancelDescription,
    preparationTimeMinutes,
    handleUpdateStatus, handleCancelPress, handleCancelModalClose,
    handleCancelReasonChange, handleCancelDescriptionChange, handleCancelConfirm,
    handlePreparationTimeDecrease, handlePreparationTimeIncrease, handlePreparationTimePreset,
  } = useOrderDetailScreen(orderId);

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
  const canChat = order.status !== ORDER_STATUS.Cancelled && order.status !== ORDER_STATUS.Completed;

  const handleCallCustomer = (): void => {
    if (order.user.phone !== null) {
      void Linking.openURL(`tel:${order.user.phone}`);
    }
  };

  const handleChatPress = (): void => {
    const orderNum = order.order_number ?? `#${orderId}`;
    if (onChatPress !== undefined) {
      onChatPress(orderId, orderNum);
    } else {
      navigation.navigate('OrderChat', { orderId, orderNumber: orderNum });
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
            {order.contact_no !== null && order.contact_no !== order.user.phone && (
              <View style={styles.row}>
                <Text style={styles.label}>Order Contact</Text>
                <Pressable
                  onPress={() => { void Linking.openURL(`tel:${order.contact_no}`); }}
                  accessibilityRole="link"
                >
                  <Text style={[styles.value, { color: colours.primary }]}>
                    {order.contact_no}
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
              <Text style={styles.value}>{PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Placed</Text>
              <Text style={styles.value}>{formatDateTime(order.created_at)}</Text>
            </View>
            {order.preparation_time_minutes !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>Prep Time</Text>
                <Text style={styles.value}>{order.preparation_time_minutes} min</Text>
              </View>
            )}
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
                  <Text style={styles.itemQty}>
                    × {item.quantity} @ {formatPrice(item.price_cents)}
                  </Text>
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

        {waitingNote !== undefined && (
          <View style={styles.infoNote}>
            <Ionicons name="time-outline" size={16} color={colours.warning} />
            <Text style={styles.infoNoteText}>{waitingNote}</Text>
          </View>
        )}

        {canChat && (
          <Pressable
            style={styles.chatButton}
            onPress={handleChatPress}
            accessibilityLabel="Chat with customer"
            accessibilityRole="button"
          >
            <Ionicons name="chatbubbles-outline" size={16} color={colours.primary} />
            <Text style={styles.chatButtonText}>Chat with Customer</Text>
          </Pressable>
        )}

        {(nextStatus === ORDER_STATUS.WaitingForPayment || nextStatus === ORDER_STATUS.PreparingFood) && (
          <View style={styles.prepTimeCard}>
            <Text style={styles.prepTimeLabel}>How long will this order take?</Text>
            <View style={styles.prepTimeStepper}>
              <Pressable
                style={styles.prepTimeBtn}
                onPress={handlePreparationTimeDecrease}
                accessibilityRole="button"
                accessibilityLabel="Decrease preparation time"
              >
                <Text style={styles.prepTimeBtnText}>−</Text>
              </Pressable>
              <Text style={styles.prepTimeValue}>{preparationTimeMinutes} min</Text>
              <Pressable
                style={styles.prepTimeBtn}
                onPress={handlePreparationTimeIncrease}
                accessibilityRole="button"
                accessibilityLabel="Increase preparation time"
              >
                <Text style={styles.prepTimeBtnText}>+</Text>
              </Pressable>
            </View>
            <View style={styles.prepTimePresets}>
              {([15, 20, 30, 45] as const).map((preset) => (
                <Pressable
                  key={preset}
                  style={[styles.prepTimePreset, preparationTimeMinutes === preset && styles.prepTimePresetActive]}
                  onPress={() => handlePreparationTimePreset(preset)}
                  accessibilityRole="button"
                  accessibilityLabel={`Set ${preset} minutes`}
                >
                  <Text style={[styles.prepTimePresetText, preparationTimeMinutes === preset && styles.prepTimePresetTextActive]}>
                    {preset}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

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

        {canCancel && (
          <Pressable
            style={[styles.cancelButton, isUpdating && styles.actionButtonDisabled]}
            onPress={handleCancelPress}
            disabled={isUpdating}
            accessibilityLabel="Cancel this order"
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </Pressable>
        )}
      </ScrollView>

      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel Order</Text>

            <View>
              <Text style={styles.modalLabel}>Reason</Text>
              {CANCEL_REASONS.map((r) => (
                <Pressable
                  key={r.value}
                  style={styles.reasonOption}
                  onPress={() => handleCancelReasonChange(r.value)}
                  accessibilityRole="radio"
                  accessibilityLabel={r.label}
                  accessibilityState={{ checked: cancelReason === r.value }}
                >
                  <View style={styles.radioOuter}>
                    {cancelReason === r.value && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.reasonOptionText}>{r.label}</Text>
                </Pressable>
              ))}
            </View>

            <View>
              <Text style={styles.modalLabel}>Additional Details (optional)</Text>
              <TextInput
                style={styles.modalTextInput}
                value={cancelDescription}
                onChangeText={handleCancelDescriptionChange}
                placeholder="Describe the reason in more detail…"
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                maxLength={500}
                accessibilityLabel="Cancel description"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={handleCancelModalClose}
                accessibilityRole="button"
                accessibilityLabel="Keep order"
              >
                <Text style={styles.modalCancelText}>Keep Order</Text>
              </Pressable>
              <Pressable
                style={[styles.modalConfirmBtn, isUpdating && { opacity: 0.6 }]}
                onPress={handleCancelConfirm}
                disabled={isUpdating}
                accessibilityRole="button"
                accessibilityLabel="Confirm cancellation"
              >
                {isUpdating
                  ? <ActivityIndicator size="small" color={colours.white} />
                  : <Text style={styles.modalConfirmText}>Confirm Cancel</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
