import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useNinetyDayReportFormScreen } from '@/features/ninetyDayReport/hooks/useNinetyDayReportFormScreen';
import { useLocale } from '@/shared/hooks/useLocale';
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
  const priceFormatted = `฿${price.toLocaleString('th-TH')}`;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color={colours.tertiary} />
          <Text style={styles.backLabel}>Select Type</Text>
        </Pressable>
        <Text style={styles.headerTypeName}>{serviceTypeName} · {serviceTypeNameEn}</Text>
        <Text style={styles.headerTitle}>90-Day Report</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isSuccess ? (
          <SuccessState
            title="Submitted!"
            subtitle={`Your 90-day report has been submitted.\nWe'll process it and notify you shortly.`}
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

              <Text style={styles.sectionTitle}>Personal Information</Text>

              <FormField
                label="Full Name"
                value={form.fullName}
                onChangeText={handleFullNameChange}
                accessibilityLabel="Full name"
                error={form.errors['fullName']}
                placeholder="As shown on passport"
                autoCapitalize="words"
                returnKeyType="next"
              />

              <FormField
                label="Phone Number"
                value={form.phone}
                onChangeText={handlePhoneChange}
                accessibilityLabel="Phone number"
                error={form.errors['phone']}
                placeholder="08x-xxx-xxxx"
                keyboardType="phone-pad"
                returnKeyType="done"
              />

              <Text style={styles.sectionTitle}>Required Documents</Text>

              <DocumentPickerField
                label={locale === 'mm' ? 'ပတ်စပို့ (ရှေ့မျက်နှာ)' : 'Passport Bio Page'}
                icon="document-text"
                onPress={handlePickPassportBioPage}
                isUploaded={form.passportBioPage !== null}
                error={form.errors['passportBioPage']}
                accessibilityLabel="Upload passport bio page image"
              />

              <DocumentPickerField
                label={locale === 'mm' ? 'ဗီဇာ မျက်နှာ' : 'Visa Page'}
                icon="id-card"
                onPress={handlePickVisaPage}
                isUploaded={form.visaPage !== null}
                error={form.errors['visaPage']}
                accessibilityLabel="Upload visa page image"
              />

              <DocumentPickerField
                label={locale === 'mm' ? 'ရက် ၉၀ စလစ်အဟောင်း' : 'Old 90-Day Report Slip'}
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
