import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useEmbassyResidentialFormScreen } from '@/features/embassyResidential/hooks/useEmbassyResidentialFormScreen';
import { styles } from './EmbassyResidentialFormScreen.styles';

export function EmbassyResidentialFormScreen(): React.JSX.Element {
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
  } = useEmbassyResidentialFormScreen();

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
          <Text style={styles.backLabel}>Other Services</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Embassy Residential</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isSuccess ? (
          <SuccessState
            title="Submitted!"
            subtitle={`Your embassy residential request has been submitted.\nWe'll process it and notify you shortly.`}
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

              {([
                { key: 'passportBioPage',   label: 'Passport Bio Page',     icon: '📄', onPick: handlePickPassportBioPage },
                { key: 'visaPage',          label: 'Visa Page',             icon: '🪪', onPick: handlePickVisaPage },
                { key: 'identityCardFront', label: 'Identity Card (Front)', icon: '🪪', onPick: handlePickIdentityCardFront },
                { key: 'identityCardBack',  label: 'Identity Card (Back)',  icon: '🪪', onPick: handlePickIdentityCardBack },
                { key: 'tm30',              label: 'TM30',                  icon: '📋', onPick: handlePickTm30,
                  hint: 'Tap to select image or PDF', uploadedHint: 'File selected — tap to change' },
              ] as const).map(({ key, label, icon, onPick, ...rest }) => (
                <DocumentPickerField
                  key={key}
                  label={label}
                  icon={icon}
                  onPress={onPick}
                  isUploaded={form[key] !== null}
                  error={form.errors[key]}
                  accessibilityLabel={`Upload ${label}`}
                  {...rest}
                />
              ))}
            </ScrollView>

            <View style={styles.submitBar}>
              <Pressable
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityLabel={`Submit embassy residential — ${priceFormatted}`}
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
