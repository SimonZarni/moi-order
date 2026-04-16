import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrderDetailScreen } from '@/features/orders/hooks/useOrderDetailScreen';
import { SubmissionDocument } from '@/types/models';
import { styles, STATUS_COLOURS } from './OrderDetailScreen.styles';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatPrice(baht: number): string {
  return `฿${baht.toLocaleString('th-TH')}`;
}

const DOC_ICONS: Record<string, string> = {
  passport_bio_page:   '📄',
  visa_page:           '🪪',
  old_slip:            '📋',
  identity_card_front:  '🪪',
  identity_card_back:   '🪪',
  tm30:                 '📋',
  upper_body_photo:     '🖼',
  airplane_ticket:      '✈',
  passport_size_photo:  '🖼',
};

export function OrderDetailScreen(): React.JSX.Element {
  const { submission, isLoading, isRefreshing, isError, canPay, handleRefresh, handleBack, handlePayNow } = useOrderDetailScreen();

  const hero = (
    <View style={styles.hero}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      <Pressable style={styles.backBtn} onPress={handleBack}
        accessibilityLabel="Go back to orders" accessibilityRole="button">
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backLabel}>Orders</Text>
      </Pressable>
      {submission !== null && (
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroEyebrow}>Order #{submission.id}</Text>
          <Text style={styles.heroTitle}>
            {submission.service_type.service?.name_en ?? submission.service_type.name_en}
          </Text>
          <Text style={styles.heroDate}>Submitted {formatDate(submission.created_at)}</Text>
        </View>
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

  if (isError || submission === null) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {hero}
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠</Text>
          <Text style={styles.stateTitle}>Could not load order</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accentColour = STATUS_COLOURS[submission.status] ?? STATUS_COLOURS['pending']!;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={styles.spinner.color} />
        }
      >
        {hero}

        <View style={styles.body}>
          {/* ── Status & price ── */}
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Summary</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={[styles.statusCard, { borderTopColor: accentColour }]}>
            <View style={styles.statusCardLeft}>
              <Text style={styles.statusCardLabel}>Service</Text>
              <Text style={styles.statusCardServiceName}>
                {submission.service_type.service?.name_en ?? submission.service_type.name_en}
              </Text>
              <View style={styles.statusCardDivider} />
              <Text style={styles.statusCardLabel}>Status</Text>
              <Text style={[styles.statusCardValue, { color: accentColour }]}>
                {submission.status_label}
              </Text>
            </View>
            <Text style={[styles.statusCardPrice, { color: accentColour }]}>
              {formatPrice(submission.price_snapshot)}
            </Text>
          </View>

          {/* ── Pay Now ── */}
          {canPay && (
            <Pressable
              style={styles.payNowBtn}
              onPress={handlePayNow}
              accessibilityLabel="Pay now"
              accessibilityRole="button"
            >
              <Text style={styles.payNowBtnText}>Pay Now</Text>
            </Pressable>
          )}

          {/* ── Personal info ── */}
          {submission.detail !== undefined && (
            <>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>Personal Info</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{submission.detail.full_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{submission.detail.phone}</Text>
                </View>
                {submission.completed_at !== null && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Completed</Text>
                    <Text style={styles.infoValue}>{formatDate(submission.completed_at)}</Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* ── Documents ── */}
          {submission.documents !== undefined && submission.documents.length > 0 && (
            <>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>Documents</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.docCard}>
                {submission.documents.map((doc: SubmissionDocument) => (
                  <React.Fragment key={doc.id}>
                    <View style={styles.docRow}>
                      <Text style={styles.docIcon}>
                        {DOC_ICONS[doc.document_type] ?? '📄'}
                      </Text>
                      <Text style={styles.docLabel}>{doc.label}</Text>
                      <Text style={styles.docCheck}>✓</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
