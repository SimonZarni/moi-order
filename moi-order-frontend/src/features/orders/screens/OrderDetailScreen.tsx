import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrderDetailScreen } from '@/features/orders/hooks/useOrderDetailScreen';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName, localeLabel } from '@/shared/utils/localeName';
import { FieldSchemaItem, SubmissionDocument } from '@/types/models';
import { styles, STATUS_COLOURS } from './OrderDetailScreen.styles';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const DOC_ICONS: Record<string, IoniconsName> = {
  passport_bio_page:    'document-text-outline',
  visa_page:            'card-outline',
  old_slip:             'clipboard-outline',
  identity_card_front:  'card-outline',
  identity_card_back:   'card-outline',
  tm30:                 'clipboard-outline',
  upper_body_photo:     'image-outline',
  airplane_ticket:      'airplane-outline',
  passport_size_photo:  'image-outline',
};

export function OrderDetailScreen(): React.JSX.Element {
  const { submission, isLoading, isRefreshing, isError, canPay, handleRefresh, handleBack, handlePayNow } = useOrderDetailScreen();
  const { locale } = useLocale();

  const hero = (
    <View style={styles.hero}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      <Pressable style={styles.backBtn} onPress={handleBack}
        accessibilityLabel="Go back to orders" accessibilityRole="button">
        <Ionicons name="chevron-back" size={20} color={colours.tertiary} />
        <Text style={styles.backLabel}>Orders</Text>
      </Pressable>
      {submission !== null && (
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroEyebrow}>Order #{submission.id}</Text>
          <Text style={styles.heroTitle}>
            {localeName(submission.service_type.service ?? submission.service_type, locale)}
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
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
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
                {localeName(submission.service_type.service ?? submission.service_type, locale)}
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
              style={({ pressed }) => [styles.payNowBtn, { opacity: pressed ? 0.8 : 1 }]}
              onPress={handlePayNow}
              accessibilityLabel="Pay now"
              accessibilityRole="button"
            >
              <Text style={styles.payNowBtnText}>Pay Now</Text>
            </Pressable>
          )}

          {/* ── Personal info (from dynamic submission_data + field_schema) ── */}
          {submission.submission_data !== undefined &&
           submission.service_type.field_schema !== undefined &&
           submission.service_type.field_schema.some((f: FieldSchemaItem) => f.type !== 'file') && (
            <>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>Personal Info</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.infoCard}>
                {submission.service_type.field_schema
                  .filter((f: FieldSchemaItem) => f.type !== 'file')
                  .map((f: FieldSchemaItem) => (
                    <View key={f.key} style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{f.label_en}</Text>
                      <Text style={styles.infoValue}>
                        {String(submission.submission_data![f.key] ?? '—')}
                      </Text>
                    </View>
                  ))
                }
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
                      <Ionicons
                        name={DOC_ICONS[doc.document_type] ?? 'document-text-outline'}
                        size={16}
                        color={colours.textMuted}
                      />
                      <Text style={styles.docLabel}>{localeLabel(doc, locale)}</Text>
                      <Ionicons name="checkmark" size={14} color={colours.success} />
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
