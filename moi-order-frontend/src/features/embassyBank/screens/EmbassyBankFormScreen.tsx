import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useEmbassyBankFormScreen } from '@/features/embassyBank/hooks/useEmbassyBankFormScreen';
import { styles } from './EmbassyBankFormScreen.styles';

export function EmbassyBankFormScreen(): React.JSX.Element {
  const {
    form,
    price,
    isSubmitting,
    isSuccess,
    bannerError,
    handleFullNameChange,
    handlePassportNoChange,
    handleIdentityCardNoChange,
    handleCurrentJobChange,
    handleCompanyChange,
    handleMyanmarAddressChange,
    handleThaiAddressChange,
    handlePhoneChange,
    handleBankNameChange,
    handlePickPassportSizePhoto,
    handlePickPassportBioPage,
    handlePickVisaPage,
    handlePickIdentityCardFront,
    handlePickIdentityCardBack,
    handlePickTm30,
    handleSubmit,
    handleBack,
  } = useEmbassyBankFormScreen();

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
        <Text style={styles.headerTitle}>Embassy Bank Service</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isSuccess ? (
          <SuccessState
            title="Submitted!"
            subtitle={`Your embassy bank service request has been submitted.\nWe'll process it and notify you shortly.`}
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
                label="Passport Number"
                value={form.passportNo}
                onChangeText={handlePassportNoChange}
                accessibilityLabel="Passport number"
                error={form.errors['passportNo']}
                placeholder="e.g. AA000000"
                autoCapitalize="characters"
                returnKeyType="next"
              />
              <FormField
                label="Identity Card No. (NRC)"
                value={form.identityCardNo}
                onChangeText={handleIdentityCardNoChange}
                accessibilityLabel="Identity card number"
                error={form.errors['identityCardNo']}
                placeholder="NRC number"
                returnKeyType="next"
              />
              <FormField
                label="Current Job (optional)"
                value={form.currentJob}
                onChangeText={handleCurrentJobChange}
                accessibilityLabel="Current job"
                error={form.errors['currentJob']}
                placeholder="Leave blank if not applicable"
                returnKeyType="next"
              />
              <FormField
                label="Company (optional)"
                value={form.company}
                onChangeText={handleCompanyChange}
                accessibilityLabel="Company"
                error={form.errors['company']}
                placeholder="Leave blank if not applicable"
                returnKeyType="next"
              />
              <FormField
                label="Myanmar Address"
                value={form.myanmarAddress}
                onChangeText={handleMyanmarAddressChange}
                accessibilityLabel="Myanmar address"
                error={form.errors['myanmarAddress']}
                placeholder="Full address in Myanmar"
                returnKeyType="next"
              />
              <FormField
                label="Thai Address"
                value={form.thaiAddress}
                onChangeText={handleThaiAddressChange}
                accessibilityLabel="Thai address"
                error={form.errors['thaiAddress']}
                placeholder="Full address in Thailand"
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
                returnKeyType="next"
              />
              <FormField
                label="Bank Name"
                value={form.bankName}
                onChangeText={handleBankNameChange}
                accessibilityLabel="Bank name"
                error={form.errors['bankName']}
                placeholder="e.g. Kasikorn Bank"
                returnKeyType="done"
              />

              <Text style={styles.sectionTitle}>Required Documents</Text>

              {([
                { key: 'passportSizePhoto', label: 'Passport Size Photo',   icon: '🖼', onPick: handlePickPassportSizePhoto },
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
                accessibilityLabel={`Submit embassy bank service — ${priceFormatted}`}
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
