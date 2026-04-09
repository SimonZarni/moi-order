import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCompanyRegistrationFormScreen } from '@/features/companyRegistration/hooks/useCompanyRegistrationFormScreen';
import { styles } from './CompanyRegistrationFormScreen.styles';

export function CompanyRegistrationFormScreen(): React.JSX.Element {
  const {
    form,
    price,
    isSubmitting,
    isSuccess,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handlePickPassportBioPage,
    handlePickVisaPage,
    handlePickIdentityCardFront,
    handlePickIdentityCardBack,
    handlePickTm30,
    handleSubmit,
    handleBack,
  } = useCompanyRegistrationFormScreen();

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
          <Text style={styles.backLabel}>Other Services</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Company Registration</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {isSuccess ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Submitted!</Text>
            <Text style={styles.successSubtitle}>
              Your company registration has been submitted.{'\n'}
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
                {form.errors['fullName'] ? <Text style={styles.fieldError}>{form.errors['fullName']}</Text> : null}
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
                {form.errors['phone'] ? <Text style={styles.fieldError}>{form.errors['phone']}</Text> : null}
              </View>

              <Text style={styles.sectionTitle}>Required Documents</Text>

              {([
                { key: 'passportBioPage',   label: 'Passport Bio Page',     icon: '📄', onPick: handlePickPassportBioPage },
                { key: 'visaPage',          label: 'Visa Page',             icon: '🪪', onPick: handlePickVisaPage },
                { key: 'identityCardFront', label: 'Identity Card (Front)', icon: '🪪', onPick: handlePickIdentityCardFront },
                { key: 'identityCardBack',  label: 'Identity Card (Back)',  icon: '🪪', onPick: handlePickIdentityCardBack },
                { key: 'tm30',             label: 'TM30',                  icon: '📋', onPick: handlePickTm30 },
              ] as const).map(({ key, label, icon, onPick }) => {
                const uploaded = form[key] !== null;
                return (
                  <View key={key} style={styles.fieldGroup}>
                    <Text style={styles.label}>{label}</Text>
                    <Pressable
                      style={[
                        styles.docPicker,
                        form.errors[key] ? styles.docPickerError : null,
                        uploaded ? styles.docPickerUploaded : null,
                      ]}
                      onPress={onPick}
                      accessibilityLabel={`Upload ${label} image`}
                      accessibilityRole="button"
                    >
                      <View style={[styles.docPickerIconBox, uploaded && styles.docPickerIconBoxUploaded]}>
                        <Text style={styles.docPickerIcon}>{uploaded ? '✓' : icon}</Text>
                      </View>
                      <View style={styles.docPickerTextCol}>
                        <Text style={styles.docPickerTitle}>{label}</Text>
                        <Text style={[styles.docPickerHint, uploaded && styles.docPickerHintUploaded]}>
                          {uploaded ? 'Image selected — tap to change' : 'Tap to select image'}
                        </Text>
                      </View>
                    </Pressable>
                    {form.errors[key] ? <Text style={styles.fieldError}>{form.errors[key]}</Text> : null}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.submitBar}>
              <Pressable
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityLabel={`Submit company registration — ${priceFormatted}`}
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
