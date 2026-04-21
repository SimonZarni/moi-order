import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import { useOrderDetailScreen } from '@/features/orders/hooks/useOrderDetailScreen';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName, localeLabel } from '@/shared/utils/localeName';
import { DOCUMENT_LABELS } from '@/shared/constants/documentLabels';
import { FieldSchemaItem, SubmissionDocument } from '@/types/models';
import { DocumentType } from '@/types/enums';
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
      {submission !== null && (
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroEyebrow}>Order #{submission.id}</Text>
          <Text style={styles.heroTitle}>
            {localeName(submission.service_type?.service ?? submission.service_type, locale)}
          </Text>
          <Text style={styles.heroDate}>Submitted {formatDate(submission.created_at)}</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Orders" />
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
        <StickyBackButton onPress={handleBack} label="Orders" />
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
      <StickyBackButton onPress={handleBack} label="Orders" />
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
                {localeName(submission.service_type?.service ?? submission.service_type, locale)}
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
           submission.service_type?.field_schema !== undefined &&
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
                      <Text style={styles.infoLabel}>{f.label_mm ?? f.label_en}</Text>
                      <Text style={styles.infoValue}>
                        {String(submission.submission_data![f.key] ?? '—')}
                      </Text>
                    </View>
                  ))
                }
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>တင်သွင်းသောနေ့</Text>
                  <Text style={styles.infoValue}>{formatDate(submission.created_at)}</Text>
                </View>
                {submission.completed_at !== null && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ပြီးစီးသောနေ့</Text>
                    <Text style={styles.infoValue}>{formatDate(submission.completed_at)}</Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* ── Documents ── */}
          {/* Old submissions: documents relation. New submissions: file fields in submission_data. */}
          {(() => {
            const oldDocs = submission.documents ?? [];
            const fileFields = (submission.service_type?.field_schema ?? []).filter(
              (f: FieldSchemaItem) => f.type === 'file' && submission.submission_data?.[f.key] != null,
            );
            const hasOldDocs = oldDocs.length > 0;
            const hasNewFiles = fileFields.length > 0;
            if (!hasOldDocs && !hasNewFiles) return null;
            return (
              <>
                <View style={styles.sectionLabelRow}>
                  <Text style={styles.sectionLabel}>Documents</Text>
                  <View style={styles.sectionLine} />
                </View>
                <View style={styles.docCard}>
                  {hasOldDocs && oldDocs.map((doc: SubmissionDocument) => (
                    <View key={doc.id} style={styles.docRow}>
                      <Ionicons
                        name={DOC_ICONS[doc.document_type] ?? 'document-text-outline'}
                        size={16}
                        color={colours.textMuted}
                      />
                      <Text style={styles.docLabel}>{doc.label_mm || doc.label}</Text>
                      <Ionicons name="checkmark" size={14} color={colours.success} />
                    </View>
                  ))}
                  {hasNewFiles && fileFields.map((f: FieldSchemaItem) => (
                    <View key={f.key} style={styles.docRow}>
                      <Ionicons
                        name={DOC_ICONS[f.key] ?? 'document-text-outline'}
                        size={16}
                        color={colours.textMuted}
                      />
                      <Text style={styles.docLabel}>
                        {f.document_type && DOCUMENT_LABELS[f.document_type as DocumentType]
                          ? DOCUMENT_LABELS[f.document_type as DocumentType].mm
                          : (f.label_mm ?? f.label_en)}
                      </Text>
                      <Ionicons name="checkmark" size={14} color={colours.success} />
                    </View>
                  ))}
                </View>
              </>
            );
          })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
