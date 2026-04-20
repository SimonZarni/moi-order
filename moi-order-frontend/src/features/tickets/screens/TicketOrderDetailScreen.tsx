import React from 'react';
import { ActivityIndicator, Image, Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import { useTicketOrderDetailScreen } from '@/features/tickets/hooks/useTicketOrderDetailScreen';
import { TicketOrderItem } from '@/types/models';
import { styles, TICKET_STATUS_COLOURS } from './TicketOrderDetailScreen.styles';

export function TicketOrderDetailScreen(): React.JSX.Element {
  const {
    order, isLoading, isRefreshing, isError,
    canPayNow, canDownload, isDownloading, isSavingEticket, downloadError,
    previewImageUrl,
    handleRefresh, handleBack, handlePayNow, handleDownloadEticket, handleSaveEticket, handleClosePreview,
  } = useTicketOrderDetailScreen();

  const hero = (
    <View style={styles.hero}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      {order !== undefined && (
        <>
          <Text style={styles.heroEyebrow}>Ticket Order #{order.id}</Text>
          <Text style={styles.heroTitle}>{order.ticket?.name ?? 'Ticket'}</Text>
          <Text style={styles.heroDate}>Ordered {formatDate(order.created_at)}</Text>
        </>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="My Tickets" />
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
        <StickyBackButton onPress={handleBack} label="My Tickets" />
        {hero}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load order</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accentColour = TICKET_STATUS_COLOURS[order.status] ?? TICKET_STATUS_COLOURS['pending_payment']!;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StickyBackButton onPress={handleBack} label="My Tickets" />

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
              : <Text style={styles.previewSaveBtnText}>Save to Gallery</Text>
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
              <Text style={styles.summaryLabel}>Visit Date</Text>
              <Text style={styles.summaryValue}>{formatDate(order.visit_date)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={[styles.statusValue, { color: accentColour }]}>{order.status_label}</Text>
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

          {/* ── Pay Now (pending / failed) ── */}
          {canPayNow && (
            <Pressable
              style={({ pressed }) => [styles.payNowBtn, { opacity: pressed ? 0.8 : 1 }]}
              onPress={handlePayNow}
              accessibilityLabel="Pay now"
              accessibilityRole="button"
            >
              <Text style={styles.payNowBtnText}>Pay Now</Text>
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
                  : <Text style={styles.downloadBtnText}>View / Download E-Ticket</Text>
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
                <Text style={styles.sectionLabel}>Items</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
