import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useNinetyDayReportFormScreen } from '@/features/ninetyDayReport/hooks/useNinetyDayReportFormScreen';
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
          <Text style={styles.backArrow}>‹</Text>
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
                label="Passport Bio Page"
                icon="📄"
                onPress={handlePickPassportBioPage}
                isUploaded={form.passportBioPage !== null}
                error={form.errors['passportBioPage']}
                accessibilityLabel="Upload passport bio page image"
              />

              <DocumentPickerField
                label="Visa Page"
                icon="🪪"
                onPress={handlePickVisaPage}
                isUploaded={form.visaPage !== null}
                error={form.errors['visaPage']}
                accessibilityLabel="Upload visa page image"
              />

              <DocumentPickerField
                label="Previous 90-Day Slip"
                icon="📋"
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
