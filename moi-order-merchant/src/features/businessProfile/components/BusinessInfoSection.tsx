import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './BusinessInfoSection.styles';
import { colours } from '../../../shared/theme/colours';
import type { KycApplication } from '../../../types/models';
import { KYC_STATUS } from '../../../types/enums';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface BusinessInfoSectionProps {
  kyc: KycApplication;
  isEditingPhone: boolean;
  phoneValue: string;
  phoneError: string | undefined;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onChangePhone: (val: string) => void;
  onSave: () => void;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const STATUS_COLOUR: Record<string, string> = {
  [KYC_STATUS.Approved]:    colours.success,
  [KYC_STATUS.Rejected]:    colours.error,
  [KYC_STATUS.UnderReview]: colours.warning,
  [KYC_STATUS.Submitted]:   colours.info,
  [KYC_STATUS.Draft]:       colours.textMuted,
};

export function BusinessInfoSection({
  kyc,
  isEditingPhone,
  phoneValue,
  phoneError,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onChangePhone,
  onSave,
}: BusinessInfoSectionProps): React.JSX.Element {
  const t = useTranslation();
  const statusColour = STATUS_COLOUR[kyc.status] ?? colours.textMuted;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('kyc_step1_title')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColour + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColour }]} />
          <Text style={[styles.statusText, { color: statusColour }]}>{kyc.status_label}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <InfoRow label={t('kyc_step1_business_name')} value={kyc.business_name} />
        <View style={styles.divider} />
        <InfoRow label={t('kyc_step1_business_type')} value={kyc.business_type} />
        <View style={styles.divider} />
        <InfoRow label={t('kyc_step1_business_address')} value={kyc.business_address} />
        <View style={styles.divider} />

        {/* Business phone — inline editable */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('kyc_step1_business_phone')}</Text>
          {isEditingPhone ? (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.phoneInput, phoneError !== undefined && styles.phoneInputError]}
                value={phoneValue}
                onChangeText={onChangePhone}
                placeholder="e.g. +959..."
                placeholderTextColor={colours.textSubtle}
                keyboardType="phone-pad"
                autoFocus
                accessibilityLabel="Business phone input"
              />
              {isSaving ? (
                <ActivityIndicator size="small" color={colours.primary} style={styles.editAction} />
              ) : (
                <>
                  <Pressable
                    onPress={onSave}
                    style={styles.editAction}
                    accessibilityLabel="Save phone number"
                    accessibilityRole="button"
                  >
                    <Ionicons name="checkmark-circle" size={22} color={colours.primary} />
                  </Pressable>
                  <Pressable
                    onPress={onCancelEdit}
                    style={styles.editAction}
                    accessibilityLabel="Cancel edit"
                    accessibilityRole="button"
                  >
                    <Ionicons name="close-circle-outline" size={22} color={colours.textMuted} />
                  </Pressable>
                </>
              )}
            </View>
          ) : (
            <View style={styles.editRow}>
              <Text style={styles.infoValue}>{kyc.business_phone ?? '—'}</Text>
              <Pressable
                onPress={onStartEdit}
                style={styles.editAction}
                accessibilityLabel="Edit business phone"
                accessibilityRole="button"
              >
                <Ionicons name="pencil-outline" size={16} color={colours.primary} />
              </Pressable>
            </View>
          )}
        </View>
        {phoneError !== undefined && <Text style={styles.fieldError}>{phoneError}</Text>}
      </View>

      {kyc.review_notes !== null && (
        <View style={styles.notesCard}>
          <Ionicons name="information-circle-outline" size={16} color={colours.warning} />
          <Text style={styles.notesText}>{kyc.review_notes}</Text>
        </View>
      )}
    </View>
  );
}
