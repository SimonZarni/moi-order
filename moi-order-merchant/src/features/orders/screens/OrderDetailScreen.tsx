import React from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, Linking, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EditOrderModal } from '../components/EditOrderModal/EditOrderModal';
import { useOrderDetailScreen } from '../hooks/useOrderDetailScreen';
import { styles } from './OrderDetailScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { ORDER_STATUS } from '../../../types/enums';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useTranslation } from '../../../shared/hooks/useTranslation';

const ORDER_ACTIONS: Partial<Record<string, string>> = {
  [ORDER_STATUS.OrderPlaced]:        ORDER_STATUS.WaitingForPayment,
  [ORDER_STATUS.PaymentConfirmed]:   ORDER_STATUS.PreparingFood,
  [ORDER_STATUS.PreparingFood]:      ORDER_STATUS.WaitingForDelivery,
  [ORDER_STATUS.WaitingForDelivery]: ORDER_STATUS.DeliveryOnTheWay,
  [ORDER_STATUS.DeliveryOnTheWay]:   ORDER_STATUS.Delivered,
  [ORDER_STATUS.Delivered]:          ORDER_STATUS.Completed,
};

const CANCELLABLE_STATUSES = new Set<string>([
  ORDER_STATUS.OrderPlaced,
  ORDER_STATUS.WaitingForPayment,
  ORDER_STATUS.PaymentConfirmed,
  ORDER_STATUS.PreparingFood,
  ORDER_STATUS.WaitingForDelivery,
  ORDER_STATUS.DeliveryOnTheWay,
]);

const EDITABLE_STATUSES = new Set<string>([
  ORDER_STATUS.OrderPlaced,
  ORDER_STATUS.WaitingForPayment,
  ORDER_STATUS.PaymentConfirmed,
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

function isChatWindowOpen(status: string, completedAt: string | null): boolean {
  if (status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Expired) return false;
  if (status === ORDER_STATUS.Completed) {
    if (completedAt === null) return false;
    return Date.now() - new Date(completedAt).getTime() < 3 * 60 * 60 * 1000;
  }
  return true;
}

interface OrderDetailScreenProps {
  orderId: string;
  onBack?: () => void;
  onChatPress?: (orderId: string, orderNumber: string, completedAt: string | null, orderStatus: string) => void;
}

export function OrderDetailScreen({ orderId, onBack, onChatPress }: OrderDetailScreenProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const t = useTranslation();

  const ACTION_LABELS: Partial<Record<string, string>> = {
    [ORDER_STATUS.OrderPlaced]:        t('action_accept'),
    [ORDER_STATUS.PaymentConfirmed]:   t('action_start_preparing'),
    [ORDER_STATUS.PreparingFood]:      t('action_mark_ready_pickup'),
    [ORDER_STATUS.WaitingForDelivery]: t('action_rider_picked_up'),
    [ORDER_STATUS.DeliveryOnTheWay]:   t('action_mark_delivered'),
    [ORDER_STATUS.Delivered]:          t('action_complete'),
  };

  const PAYMENT_LABELS: Record<string, string> = {
    cod:        t('payment_cod'),
    prompt_pay: t('payment_prompt_pay'),
    line_pay:   t('payment_line_pay'),
  };

  const WAITING_NOTES: Partial<Record<string, string>> = {
    [ORDER_STATUS.WaitingForPayment]: t('order_detail_waiting_payment_note'),
  };

  const CANCEL_REASONS = [
    { value: 'closing_soon', label: t('order_detail_cancel_closing') },
    { value: 'sold_out',     label: t('order_detail_cancel_sold_out') },
    { value: 'out_of_range', label: t('order_detail_cancel_out_of_range') },
  ];

  const {
    order, isLoading, isError, isUpdating,
    cancelModalVisible, cancelReason, cancelDescription,
    preparationTimeMinutes,
    editModalVisible,
    handleUpdateStatus, handleCancelPress, handleCancelModalClose,
    handleCancelReasonChange, handleCancelDescriptionChange, handleCancelConfirm,
    handlePreparationTimeDecrease, handlePreparationTimeIncrease, handlePreparationTimePreset,
    handleEditPress, handleEditClose,
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
        <Text style={styles.errorText}>{t('order_detail_cannot_load')}</Text>
        {onBack !== undefined && (
          <Pressable onPress={onBack} accessibilityRole="button" style={{ marginTop: 4 }}>
            <Text style={{ color: colours.primary, fontWeight: '600' }}>{t('order_detail_go_back')}</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const nextStatus = ORDER_ACTIONS[order.status];
  const actionLabel = ACTION_LABELS[order.status];
  const waitingNote = WAITING_NOTES[order.status];
  const canCancel = CANCELLABLE_STATUSES.has(order.status);
  const canEdit   = EDITABLE_STATUSES.has(order.status);
  const statusColour = STATUS_COLOURS[order.status] ?? colours.medium;
  const canChat = isChatWindowOpen(order.status, order.completed_at);

  const handleCallCustomer = (): void => {
    if (order.user.phone !== null) {
      void Linking.openURL(`tel:${order.user.phone}`);
    }
  };

  const handleChatPress = (): void => {
    const orderNum = order.order_number ?? `#${orderId}`;
    if (onChatPress !== undefined) {
      onChatPress(orderId, orderNum, order.completed_at, order.status);
    } else {
      navigation.navigate('OrderChat', {
        orderId,
        orderNumber: orderNum,
        completedAt: order.completed_at,
        orderStatus: order.status,
      });
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
            <Text style={styles.cardTitle}>{t('order_detail_customer')}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('order_detail_name')}</Text>
              <Text style={styles.value}>{order.user.name}</Text>
            </View>
            {order.user.phone !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>{t('order_detail_phone')}</Text>
                <Pressable onPress={handleCallCustomer} accessibilityRole="link">
                  <Text style={[styles.value, { color: colours.primary }]}>
                    {order.user.phone}
                  </Text>
                </Pressable>
              </View>
            )}
            {order.contact_no !== null && order.contact_no !== order.user.phone && (
              <View style={styles.row}>
                <Text style={styles.label}>{t('order_detail_contact')}</Text>
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
                <Text style={styles.label}>{t('order_detail_address')}</Text>
                <Text style={styles.value}>{order.delivery_address}</Text>
              </View>
            )}
            {order.customer_notes !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>{t('order_detail_notes')}</Text>
                <Text style={styles.value}>{order.customer_notes}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('order_detail_order_details')}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('order_detail_order_num')}</Text>
              <Text style={styles.value}>{order.order_number ?? order.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('order_detail_payment')}</Text>
              <Text style={styles.value}>{PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('order_detail_placed')}</Text>
              <Text style={styles.value}>{formatDateTime(order.created_at)}</Text>
            </View>
            {order.preparation_time_minutes !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>{t('order_detail_prep_time')}</Text>
                <Text style={styles.value}>{order.preparation_time_minutes} {t('common_min')}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.cardHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.cardTitle}>{t('order_detail_items')} ({order.items.length})</Text>
            {canEdit && (
              <Pressable
                onPress={handleEditPress}
                accessibilityRole="button"
                accessibilityLabel="Edit order items"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Ionicons name="pencil-outline" size={13} color={colours.primary} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: colours.primary }}>Edit</Text>
              </Pressable>
            )}
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
              <Text style={styles.label}>{t('order_detail_subtotal')}</Text>
              <Text style={styles.value}>{formatPrice(order.subtotal_cents)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('order_detail_total')}</Text>
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
            <Text style={styles.chatButtonText}>{t('order_detail_chat_customer')}</Text>
          </Pressable>
        )}

        {nextStatus === ORDER_STATUS.PreparingFood && (
          <View style={styles.prepTimeCard}>
            <Text style={styles.prepTimeLabel}>{t('order_detail_how_long')}</Text>
            <View style={styles.prepTimeStepper}>
              <Pressable
                style={styles.prepTimeBtn}
                onPress={handlePreparationTimeDecrease}
                accessibilityRole="button"
                accessibilityLabel="Decrease preparation time"
              >
                <Text style={styles.prepTimeBtnText}>−</Text>
              </Pressable>
              <Text style={styles.prepTimeValue}>{preparationTimeMinutes} {t('common_min')}</Text>
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
              {isUpdating ? t('order_detail_updating') : actionLabel}
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
            <Text style={styles.cancelButtonText}>{t('order_detail_cancel_order')}</Text>
          </Pressable>
        )}
      </ScrollView>

      <EditOrderModal
        order={order}
        visible={editModalVisible}
        onClose={handleEditClose}
      />

      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('order_detail_cancel_title')}</Text>

            <View>
              <Text style={styles.modalLabel}>{t('order_detail_reason')}</Text>
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
              <Text style={styles.modalLabel}>{t('order_detail_additional_details')}</Text>
              <TextInput
                style={styles.modalTextInput}
                value={cancelDescription}
                onChangeText={handleCancelDescriptionChange}
                placeholder={t('order_detail_details_placeholder')}
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
                <Text style={styles.modalCancelText}>{t('order_detail_keep_order')}</Text>
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
                  : <Text style={styles.modalConfirmText}>{t('order_detail_confirm_cancel')}</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
