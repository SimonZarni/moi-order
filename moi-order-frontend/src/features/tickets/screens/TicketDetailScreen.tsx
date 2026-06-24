import React from 'react';
import { Linking, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatPrice } from '@/shared/utils/formatCurrency';
import { useTicketDetailScreen } from '@/features/tickets/hooks/useTicketDetailScreen';
import { TicketGallery } from '@/features/tickets/components/TicketGallery';
import { TicketVariantCard } from '@/features/tickets/components/TicketVariantCard';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { TicketDetailSkeleton } from '@/features/tickets/components/TicketDetailSkeleton';
import { TicketVariant } from '@/types/models';
import { styles } from './TicketDetailScreen.styles';

export function TicketDetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    ticket, isLoading, isRefreshing, isError, selections,
    totalItems, totalPrice, canProceed,
    handleIncrement, handleDecrement, handleRefresh, handlePayNow, handleBack,
  } = useTicketDetailScreen();

  if (isLoading || ticket === undefined) {
    return <TicketDetailSkeleton />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.errorBackWrap}>
          <BackButton onPress={handleBack} />
        </View>
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load ticket</Text>
          <Text style={styles.stateSubtitle}>Go back and try again</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.primary} />}
      >
        <TicketGallery
          images={[
            ...(ticket.cover_image_url != null ? [ticket.cover_image_url] : []),
            ...[...(ticket.images ?? [])]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(img => img.url)
              .filter(url => url !== ticket.cover_image_url),
          ]}
          backSlot={
            <View style={styles.coverBackWrap}>
              <BackButton onPress={handleBack} />
            </View>
          }
        />

        <View style={styles.infoBlock}>
          <Text style={styles.ticketName}>{ticket.name}</Text>
          <Text style={styles.highlight}>{ticket.highlight_description}</Text>
          <View style={styles.highlightDivider} />
          <Text style={styles.description}>{ticket.description}</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colours.textMuted} />
            <Text style={styles.addressText}>{ticket.address}, {ticket.city}</Text>
            {ticket.google_maps_link.length > 0 && (
              <Pressable
                onPress={() => Linking.openURL(ticket.google_maps_link)}
                accessibilityLabel="Get directions in Google Maps"
                accessibilityRole="button"
                style={styles.directionsBtn}
              >
                <Ionicons name="navigate-outline" size={12} color={colours.primary} />
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </Pressable>
            )}
          </View>
          {(ticket.open_time !== null || ticket.operating_days !== null) && (
            <View style={styles.scheduleRow}>
              <Ionicons name="time-outline" size={14} color={colours.textMuted} />
              <Text style={styles.scheduleText}>
                {[
                  ticket.open_time && ticket.close_time
                    ? `${ticket.open_time} – ${ticket.close_time}`
                    : ticket.open_time ?? null,
                  ticket.operating_days,
                ]
                  .filter(Boolean)
                  .join('  ·  ')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Select Tickets</Text>
          <View style={styles.sectionLine} />
        </View>

        {(ticket.variants ?? []).map((variant: TicketVariant) => (
          <TicketVariantCard
            key={variant.id}
            variant={variant}
            selection={selections[variant.id]}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 32 + insets.bottom }]}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>{totalItems} ticket{totalItems !== 1 ? 's' : ''} selected</Text>
          <Text style={styles.footerTotal}>{formatPrice(totalPrice)}</Text>
        </View>
        <Pressable
          style={[styles.payNowBtn, !canProceed && styles.payNowBtnDisabled]}
          onPress={handlePayNow}
          disabled={!canProceed}
          accessibilityLabel="Pay now"
          accessibilityRole="button"
        >
          <Text style={styles.payNowBtnText}>Pay Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
