import React from 'react';
import { ActivityIndicator, Image, Linking, Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { LINE_OA_URL } from '@/shared/constants/config';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { useTicketOrderDetailScreen } from '@/features/tickets/hooks/useTicketOrderDetailScreen';
import { TicketOrderItem } from '@/types/models';
import { useStrings } from '@/shared/i18n';
import { styles, TICKET_STATUS_COLOURS } from './TicketOrderDetailScreen.styles';

export function TicketOrderDetailScreen(): React.JSX.Element {
  const {
    order, isLoading, isRefreshing, isError,
    canPayNow, awaitingConfirmation, canDownload, isDownloading, isSavingEticket, downloadError,
    previewImageUrl,
    handleRefresh, handleBack, handlePayNow, handleDownloadEticket, handleSaveEticket, handleClosePreview,
    canCancel, isCancelling, handleCancelOrder,
  } = useTicketOrderDetailScreen();
  const s = useStrings();

  const hero = (
    <View style={styles.hero}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      <BackButton onPress={handleBack} />
      {order !== undefined && (
        <>
          <Text style={styles.heroEyebrow}>{s.tickets.orderNum.replace('{id}', String(order.id))}</Text>
          <Text style={styles.heroTitle}>{order.ticket?.name ?? 'Ticket'}</Text>
          <Text style={styles.heroDate}>{s.tickets.ordered} {formatDate(order.created_at)}</Text>
        </>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {hero}
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={styles.spinner.color} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || order === undefined) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {hero}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>{s.tickets.couldNotLoad}</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accentColour = TICKET_STATUS_COLOURS[order.status] ?? TICKET_STATUS_COLOURS['pending_payment']!;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Image preview modal ── */}
      <Modal
        visible={previewImageUrl !== null}
        transparent
        animationType="fade"
        onRequestClose={handleClosePreview}
      >
        <View style={styles.previewOverlay}>
          <Pressable
            style={styles.previewClose}
            onPress={handleClosePreview}
            accessibilityLabel="Close preview"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={28} color={colours.textOnDark} />
          </Pressable>
          {previewImageUrl !== null && (
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.previewImage}
              resizeMode="contain"
              accessibilityLabel="E-ticket preview"
            />
          )}
          <Pressable
            style={styles.previewSaveBtn}
            onPress={handleSaveEticket}
            disabled={isSavingEticket}
            accessibilityLabel="Save e-ticket to gallery"
            accessibilityRole="button"
          >
            {isSavingEticket
              ? <ActivityIndicator color="white" />
              : <Text style={styles.previewSaveBtnText}>{s.common.saveToGallery}</Text>
            }
          </Pressable>
        </View>
      </Modal>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={styles.spinner.color} />}
      >
        {hero}

        <View style={styles.body}>
          {/* ── Summary card ── */}
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Summary</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={[styles.summaryCard, { borderTopColor: accentColour }]}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{s.tickets.visitDate}</Text>
              <Text style={styles.summaryValue}>{formatDate(order.visit_date)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={[styles.statusValue, { color: accentColour }]}>{(s.status as Record<string, string>)[order.status] ?? order.status_label}</Text>
            </View>
            {order.total !== undefined && (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
                </View>
              </>
            )}
          </View>

          {/* ── Pay Now (pending / failed + authorized) ── */}
          {canPayNow && (
            <Pressable
              style={({ pressed }) => [styles.payNowBtn, { opacity: pressed ? 0.8 : 1 }]}
              onPress={handlePayNow}
              accessibilityLabel="Pay now"
              accessibilityRole="button"
            >
              <Text style={styles.payNowBtnText}>{s.common.payNow}</Text>
            </Pressable>
          )}

          {/* ── Awaiting admin confirmation ── */}
          {awaitingConfirmation && (
            <View style={styles.awaitingBox}>
              <Text style={styles.awaitingText}>{s.orders.awaitingConfirmation}</Text>
            </View>
          )}

          {/* ── Cancel Order (pending payment only) ── */}
          {canCancel && (
            <Pressable
              style={[styles.cancelOrderBtn, isCancelling && styles.cancelOrderBtnDisabled]}
              onPress={handleCancelOrder}
              disabled={isCancelling}
              accessibilityLabel="Cancel order"
              accessibilityRole="button"
            >
              <Text style={styles.cancelOrderBtnText}>
                {isCancelling ? s.common.cancelling : s.common.cancelOrder}
              </Text>
            </Pressable>
          )}

          {/* ── Download / Preview E-Ticket (completed) ── */}
          {canDownload && (
            <>
              <Pressable
                style={styles.downloadBtn}
                onPress={handleDownloadEticket}
                disabled={isDownloading}
                accessibilityLabel="View e-ticket"
                accessibilityRole="button"
              >
                {isDownloading
                  ? <ActivityIndicator color="white" />
                  : <Text style={styles.downloadBtnText}>{s.tickets.viewDownloadEticket}</Text>
                }
              </Pressable>
              {downloadError !== null && (
                <Text style={styles.downloadError}>{downloadError}</Text>
              )}
            </>
          )}

          {/* ── Items ── */}
          {order.items !== undefined && order.items.length > 0 && (
            <>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>{s.orders.items}</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.itemCard}>
                {order.items.map((item: TicketOrderItem) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemLeft}>
                      <Text style={styles.itemName}>{item.variant?.name ?? 'Ticket'}</Text>
                      <Text style={styles.itemQty}>× {item.quantity} @ {formatPrice(item.price_snapshot)}</Text>
                    </View>
                    <Text style={styles.itemSubtotal}>{formatPrice(item.subtotal)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── Contact Us ── */}
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>{s.orders.contactUs}</Text>
            <View style={styles.sectionLine} />
          </View>
          <Pressable
            style={({ pressed }) => [styles.lineBtn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => Linking.openURL(LINE_OA_URL)}
            accessibilityLabel="Contact us on LINE @moiorder"
            accessibilityRole="button"
          >
            <View style={styles.lineBtnBadge}>
              <Text style={styles.lineBtnBadgeText}>LINE</Text>
            </View>
            <Text style={styles.lineBtnText}>@moiorder</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
