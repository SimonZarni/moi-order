import React from 'react';
import { colours } from '@/shared/theme/colours';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/shared/components/BackButton/BackButton';
import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useNinetyDayReportFormScreen } from '@/features/ninetyDayReport/hooks/useNinetyDayReportFormScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { useStrings } from '@/shared/i18n';
import { styles } from './NinetyDayReportFormScreen.styles';

export function NinetyDayReportFormScreen(): React.JSX.Element {
  const {
    form,
    serviceTypeName,
    serviceTypeNameEn,
    price,
    isSubmitting,
    isSuccess,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handlePickPassportBioPage,
    handlePickVisaPage,
    handlePickOldSlip,
    handleSubmit,
    handleBack,
  } = useNinetyDayReportFormScreen();

  const { locale } = useLocale();
  const s = useStrings();
  const priceFormatted = `฿${price.toLocaleString('th-TH')}`;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTypeName}>{serviceTypeName} · {serviceTypeNameEn}</Text>
        <Text style={[styles.headerTitle, locale === 'mm' && { fontSize: 20, lineHeight: 30 }]}>{s.services.ninetyDayTitle}</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isSuccess ? (
          <SuccessState
            title="Submitted!"
            subtitle={s.services.ninetyDaySubmitted}
            buttonLabel="Back to Services"
            onButtonPress={handleBack}
          />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ErrorBanner message={bannerError} />

              <Text style={[styles.sectionTitle, locale === 'mm' && { fontSize: 10, lineHeight: 18, includeFontPadding: false }]}>{s.form.personalInfo}</Text>

              <FormField
                label={s.form.fullName}
                value={form.fullName}
                onChangeText={handleFullNameChange}
                accessibilityLabel="Full name"
                error={form.errors['fullName']}
                placeholder="As shown on passport"
                autoCapitalize="words"
                returnKeyType="next"
              />

              <FormField
                label={s.form.phoneNumber}
                value={form.phone}
                onChangeText={handlePhoneChange}
                accessibilityLabel="Phone number"
                error={form.errors['phone']}
                placeholder="08x-xxx-xxxx"
                keyboardType="phone-pad"
                returnKeyType="done"
              />

              <Text style={styles.sectionTitle}>{s.form.requiredDocuments}</Text>

              <DocumentPickerField
                label={s.docs.passportBioPage}
                icon="document-text"
                onPress={handlePickPassportBioPage}
                isUploaded={form.passportBioPage !== null}
                error={form.errors['passportBioPage']}
                accessibilityLabel="Upload passport bio page image"
              />

              <DocumentPickerField
                label={s.docs.visaPage}
                icon="id-card"
                onPress={handlePickVisaPage}
                isUploaded={form.visaPage !== null}
                error={form.errors['visaPage']}
                accessibilityLabel="Upload visa page image"
              />

              <DocumentPickerField
                label={s.docs.oldSlip}
                icon="newspaper"
                onPress={handlePickOldSlip}
                isUploaded={form.oldSlip !== null}
                error={form.errors['oldSlip']}
                accessibilityLabel="Upload previous 90-day report slip image"
              />
            </ScrollView>

            <View style={styles.submitBar}>
              <Pressable
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityLabel={`Submit 90-day report — ${priceFormatted}`}
                accessibilityRole="button"
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? 'Submitting…' : `Submit · ${priceFormatted}`}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
