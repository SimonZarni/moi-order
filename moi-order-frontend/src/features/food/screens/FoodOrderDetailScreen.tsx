import React from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { FoodOrderItem } from '@/types/models';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { InvoiceModal } from '../components/InvoiceModal';
import { OrderProgressBar } from '../components/OrderProgressBar';
import { OrderRatingInput } from '../components/OrderRatingInput';
import { SlideToComplete } from '../components/SlideToComplete';
import { useFoodOrderDetailScreen } from '../hooks/useFoodOrderDetailScreen';
import { styles } from './FoodOrderDetailScreen.styles';

export function FoodOrderDetailScreen(): React.JSX.Element {
  const {
    order, isLoading,
    isPaymentTimedOut,
    invoiceVisible, handleInvoiceOpen, handleInvoiceClose,
    completeModalVisible, isCompleting,
    rating, review,
    copyMessage, copyHint, hasCopied, locale,
    handleBack, handlePromptPayPress, handleCopyMessage, handleChatPress,
    handleSlideComplete, handleCompleteConfirm, handleCompleteCancel,
    handleRatingChange, handleReviewChange,
    handleCallRestaurant, handleOrderAgain,
    handleCancelOrder, isCancelling,
  } = useFoodOrderDetailScreen();

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

  const canViewInvoice     = order.payment_confirmed_at !== null || order.status === FOOD_ORDER_STATUS.Completed;
  const canComplete        = order.status === FOOD_ORDER_STATUS.Delivered;
  const isCompleted        = order.status === FOOD_ORDER_STATUS.Completed;
  const isCancelled        = order.status === FOOD_ORDER_STATUS.Cancelled;
  const isExpired          = order.status === FOOD_ORDER_STATUS.Expired;
  const isTerminal         = isCompleted || isCancelled || isExpired;
  const hasRestaurantPhone = order.restaurant_phone != null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Order #{order.order_number ?? order.id}</Text>
        {canViewInvoice && (
          <Pressable style={styles.invoiceIconBtn} onPress={handleInvoiceOpen} accessibilityRole="button" accessibilityLabel="View invoice">
            <Ionicons name="receipt-outline" size={18} color={colours.textOnDark} />
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Payment timeout banner — restaurant hasn't responded for 15+ minutes */}
        {isPaymentTimedOut && (
          <View style={styles.timeoutBanner}>
            <Ionicons name="time-outline" size={16} color="#92400e" />
            <Text style={styles.timeoutText}>
              The restaurant hasn&apos;t confirmed yet. You can cancel this order below.
            </Text>
          </View>
        )}

        {isCancelled ? (
          <View style={styles.cancelledCard}>
            <Text style={styles.cancelledText}>This order has been cancelled.</Text>
          </View>
        ) : isExpired ? (
          <View style={styles.expiredCard}>
            <Text style={styles.expiredText}>This order expired — the restaurant did not respond in time.</Text>
          </View>
        ) : (
          <OrderProgressBar
            status={order.status}
            canShowPromptPay={order.can_show_prompt_pay}
            onPromptPayPress={handlePromptPayPress}
            copyMessage={copyMessage}
            copyHint={copyHint}
            hasCopied={hasCopied}
            onCopyPress={handleCopyMessage}
            locale={locale}
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
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatPrice(order.subtotal_cents / 100)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: '700' }]}>Total</Text>
            <Text style={[styles.totalValue, { fontWeight: '700' }]}>{formatPrice(order.total_cents / 100)}</Text>
          </View>
        </View>

        {order.can_cancel && (
          <Pressable
            style={styles.cancelBtn}
            onPress={handleCancelOrder}
            disabled={isCancelling}
            accessibilityRole="button"
            accessibilityLabel="Cancel this order"
          >
            {isCancelling
              ? <ActivityIndicator size="small" color={colours.danger} />
              : <>
                  <Ionicons name="close-circle-outline" size={16} color={colours.danger} />
                  <Text style={styles.cancelBtnText}>Cancel Order</Text>
                </>
            }
          </Pressable>
        )}

        {canViewInvoice && (
          <Pressable style={styles.invoiceBtn} onPress={handleInvoiceOpen} accessibilityRole="button" accessibilityLabel="View full invoice">
            <Ionicons name="receipt-outline" size={16} color={colours.primary} />
            <Text style={styles.invoiceBtnText}>View Invoice</Text>
          </Pressable>
        )}

        {/* Order Again — shown for completed, cancelled, and expired orders */}
        {isTerminal && (
          <Pressable style={styles.orderAgainBtn} onPress={handleOrderAgain} accessibilityRole="button" accessibilityLabel="Order again from this restaurant">
            <Ionicons name="refresh-outline" size={16} color={colours.white} />
            <Text style={styles.orderAgainBtnText}>Order Again</Text>
          </Pressable>
        )}

        {canComplete && (
          <View style={styles.completeSection}>
            <SlideToComplete onComplete={handleSlideComplete} />
            <Text style={styles.autoCompleteNotice}>
              Order will complete automatically in 10 minutes if not confirmed.
            </Text>
            {hasRestaurantPhone && (
              <Pressable style={styles.callBtn} onPress={handleCallRestaurant} accessibilityRole="button" accessibilityLabel="Call restaurant">
                <Ionicons name="call-outline" size={14} color={colours.primary} />
                <Text style={styles.callBtnText}>Contact Restaurant</Text>
              </Pressable>
            )}
          </View>
        )}

        {!isCancelled && !isExpired && (
          <Pressable
            style={styles.chatBtn}
            onPress={handleChatPress}
            accessibilityRole="button"
            accessibilityLabel="Open chat with restaurant"
          >
            <Ionicons name="chatbubbles-outline" size={18} color={colours.textOnDark} />
            <Text style={styles.chatBtnText}>
              {locale === 'mm' ? 'ဆိုင်နှင့် ချတ်ဆွေးနွေးမည်' : locale === 'th' ? 'แชทกับร้านอาหาร' : 'Chat with Restaurant'}
            </Text>
          </Pressable>
        )}

        {order.customer_notes !== null && (
          <>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}><Text style={styles.notesText}>{order.customer_notes}</Text></View>
          </>
        )}
      </ScrollView>

      {canViewInvoice && (
        <InvoiceModal order={order} visible={invoiceVisible} onClose={handleInvoiceClose} />
      )}

      {/* Complete order confirmation modal */}
      <Modal visible={completeModalVisible} transparent animationType="fade" onRequestClose={handleCompleteCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mark this order as complete?</Text>
            <Text style={styles.modalSub}>You can also leave a rating and review.</Text>
            <OrderRatingInput
              rating={rating}
              review={review}
              onRatingChange={handleRatingChange}
              onReviewChange={handleReviewChange}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={handleCompleteCancel} accessibilityRole="button" accessibilityLabel="Cancel">
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalDoneBtn} onPress={handleCompleteConfirm} disabled={isCompleting} accessibilityRole="button" accessibilityLabel="Confirm complete">
                {isCompleting
                  ? <ActivityIndicator size="small" color={colours.white} />
                  : <Text style={styles.modalDoneText}>Done</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
