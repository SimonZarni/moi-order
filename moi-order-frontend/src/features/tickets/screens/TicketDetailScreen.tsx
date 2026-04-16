import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatPrice } from '@/shared/utils/formatCurrency';
import { useTicketDetailScreen } from '@/features/tickets/hooks/useTicketDetailScreen';
import { TicketVariant } from '@/types/models';
import { styles } from './TicketDetailScreen.styles';

export function TicketDetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    ticket, isLoading, isError, selections,
    totalItems, totalPrice, canProceed,
    handleIncrement, handleDecrement, handlePayNow, handleBack,
  } = useTicketDetailScreen();

  if (isLoading || ticket === undefined) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={styles.spinner.color} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠</Text>
          <Text style={styles.stateTitle}>Could not load ticket</Text>
          <Text style={styles.stateSubtitle}>Go back and try again</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: ticket.cover_image_url }} style={styles.cover} resizeMode="cover" />
          <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.ticketName}>{ticket.name}</Text>
          <Text style={styles.highlight}>{ticket.highlight_description}</Text>
          <Text style={styles.description}>{ticket.description}</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>📍 {ticket.address}, {ticket.city}</Text>
          </View>
        </View>

        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Select Tickets</Text>
          <View style={styles.sectionLine} />
        </View>

        {(ticket.variants ?? []).map((variant: TicketVariant) => (
          <View key={variant.id} style={styles.variantCard}>
            <View style={styles.variantInfo}>
              <Text style={styles.variantName}>{variant.name}</Text>
              {variant.description !== null && (
                <Text style={styles.variantDesc} numberOfLines={2}>{variant.description}</Text>
              )}
              <Text style={styles.variantPrice}>{formatPrice(variant.price)}</Text>
            </View>
            <View style={styles.qtyControl}>
              <Pressable
                style={[styles.qtyBtn, (selections[variant.id] ?? 0) === 0 && styles.qtyBtnDisabled]}
                onPress={() => handleDecrement(variant.id)}
                accessibilityLabel={`Decrease quantity for ${variant.name}`}
                accessibilityRole="button"
                disabled={(selections[variant.id] ?? 0) === 0}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={styles.qtyValue}>{selections[variant.id] ?? 0}</Text>
              <Pressable
                style={[styles.qtyBtn, (selections[variant.id] ?? 0) >= 15 && styles.qtyBtnDisabled]}
                onPress={() => handleIncrement(variant.id)}
                accessibilityLabel={`Increase quantity for ${variant.name}`}
                accessibilityRole="button"
                disabled={(selections[variant.id] ?? 0) >= 15}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
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
