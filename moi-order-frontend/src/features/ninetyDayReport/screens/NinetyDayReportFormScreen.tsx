import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      {/* Header */}
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

      {/* Body */}
      <View style={styles.body}>
        {isSuccess ? (
          /* ── Success state ── */
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Submitted!</Text>
            <Text style={styles.successSubtitle}>
              Your 90-day report has been submitted.{'\n'}
              We'll process it and notify you shortly.
            </Text>
            <Pressable
              style={styles.successBtn}
              onPress={handleBack}
              accessibilityLabel="Back to services"
              accessibilityRole="button"
            >
              <Text style={styles.successBtnText}>Back to Services</Text>
            </Pressable>
          </View>
        ) : (
          /* ── Form ── */
          <>
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {bannerError.length > 0 && (
                <View style={styles.banner}>
                  <Text style={styles.bannerText}>{bannerError}</Text>
                </View>
              )}

              {/* Personal Information */}
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputWrapper, form.errors['fullName'] ? styles.inputWrapperError : null]}>
                  <TextInput
                    style={styles.input}
                    value={form.fullName}
                    onChangeText={handleFullNameChange}
                    placeholder="As shown on passport"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="words"
                    returnKeyType="next"
                    accessibilityLabel="Full name"
                  />
                </View>
                {form.errors['fullName'] ? (
                  <Text style={styles.fieldError}>{form.errors['fullName']}</Text>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.inputWrapper, form.errors['phone'] ? styles.inputWrapperError : null]}>
                  <TextInput
                    style={styles.input}
                    value={form.phone}
                    onChangeText={handlePhoneChange}
                    placeholder="08x-xxx-xxxx"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    accessibilityLabel="Phone number"
                  />
                </View>
                {form.errors['phone'] ? (
                  <Text style={styles.fieldError}>{form.errors['phone']}</Text>
                ) : null}
              </View>

              {/* Required Documents */}
              <Text style={styles.sectionTitle}>Required Documents</Text>

              {/* Passport Bio Page */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Passport Bio Page</Text>
                <Pressable
                  style={[
                    styles.docPicker,
                    form.errors['passportBioPage'] ? styles.docPickerError : null,
                    form.passportBioPage !== null ? styles.docPickerUploaded : null,
                  ]}
                  onPress={handlePickPassportBioPage}
                  accessibilityLabel="Upload passport bio page image"
                  accessibilityRole="button"
                >
                  <View style={[styles.docPickerIconBox, form.passportBioPage !== null && styles.docPickerIconBoxUploaded]}>
                    <Text style={styles.docPickerIcon}>
                      {form.passportBioPage !== null ? '✓' : '📄'}
                    </Text>
                  </View>
                  <View style={styles.docPickerTextCol}>
                    <Text style={styles.docPickerTitle}>Passport Bio Page</Text>
                    <Text style={[styles.docPickerHint, form.passportBioPage !== null && styles.docPickerHintUploaded]}>
                      {form.passportBioPage !== null ? 'Image selected — tap to change' : 'Tap to select image'}
                    </Text>
                  </View>
                </Pressable>
                {form.errors['passportBioPage'] ? (
                  <Text style={styles.fieldError}>{form.errors['passportBioPage']}</Text>
                ) : null}
              </View>

              {/* Visa Page */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Visa Page</Text>
                <Pressable
                  style={[
                    styles.docPicker,
                    form.errors['visaPage'] ? styles.docPickerError : null,
                    form.visaPage !== null ? styles.docPickerUploaded : null,
                  ]}
                  onPress={handlePickVisaPage}
                  accessibilityLabel="Upload visa page image"
                  accessibilityRole="button"
                >
                  <View style={[styles.docPickerIconBox, form.visaPage !== null && styles.docPickerIconBoxUploaded]}>
                    <Text style={styles.docPickerIcon}>
                      {form.visaPage !== null ? '✓' : '🪪'}
                    </Text>
                  </View>
                  <View style={styles.docPickerTextCol}>
                    <Text style={styles.docPickerTitle}>Visa Page</Text>
                    <Text style={[styles.docPickerHint, form.visaPage !== null && styles.docPickerHintUploaded]}>
                      {form.visaPage !== null ? 'Image selected — tap to change' : 'Tap to select image'}
                    </Text>
                  </View>
                </Pressable>
                {form.errors['visaPage'] ? (
                  <Text style={styles.fieldError}>{form.errors['visaPage']}</Text>
                ) : null}
              </View>

              {/* Old Slip */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Previous 90-Day Slip</Text>
                <Pressable
                  style={[
                    styles.docPicker,
                    form.errors['oldSlip'] ? styles.docPickerError : null,
                    form.oldSlip !== null ? styles.docPickerUploaded : null,
                  ]}
                  onPress={handlePickOldSlip}
                  accessibilityLabel="Upload previous 90-day report slip image"
                  accessibilityRole="button"
                >
                  <View style={[styles.docPickerIconBox, form.oldSlip !== null && styles.docPickerIconBoxUploaded]}>
                    <Text style={styles.docPickerIcon}>
                      {form.oldSlip !== null ? '✓' : '📋'}
                    </Text>
                  </View>
                  <View style={styles.docPickerTextCol}>
                    <Text style={styles.docPickerTitle}>Old 90-Day Slip</Text>
                    <Text style={[styles.docPickerHint, form.oldSlip !== null && styles.docPickerHintUploaded]}>
                      {form.oldSlip !== null ? 'Image selected — tap to change' : 'Tap to select image'}
                    </Text>
                  </View>
                </Pressable>
                {form.errors['oldSlip'] ? (
                  <Text style={styles.fieldError}>{form.errors['oldSlip']}</Text>
                ) : null}
              </View>
            </ScrollView>

            {/* Sticky submit bar */}
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
