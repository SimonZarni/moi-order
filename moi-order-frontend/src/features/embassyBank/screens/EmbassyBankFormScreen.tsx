import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useEmbassyBankFormScreen } from '@/features/embassyBank/hooks/useEmbassyBankFormScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeDocumentLabel } from '@/shared/utils/localeName';
import { DOCUMENT_TYPE, DocumentType } from '@/types/enums';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
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
                { key: 'passportSizePhoto' as const, docType: DOCUMENT_TYPE.PassportSizePhoto,  icon: 'images' as const,        onPick: handlePickPassportSizePhoto },
                { key: 'passportBioPage'   as const, docType: DOCUMENT_TYPE.PassportBioPage,    icon: 'document-text' as const, onPick: handlePickPassportBioPage },
                { key: 'visaPage'          as const, docType: DOCUMENT_TYPE.VisaPage,           icon: 'card' as const,          onPick: handlePickVisaPage },
                { key: 'identityCardFront' as const, docType: DOCUMENT_TYPE.IdentityCardFront,  icon: 'card-outline' as const,  onPick: handlePickIdentityCardFront },
                { key: 'identityCardBack'  as const, docType: DOCUMENT_TYPE.IdentityCardBack,   icon: 'card-outline' as const,  onPick: handlePickIdentityCardBack },
                { key: 'tm30'              as const, docType: DOCUMENT_TYPE.Tm30,               icon: 'clipboard' as const,     onPick: handlePickTm30,
                  hint: 'Tap to select image or PDF', uploadedHint: 'File selected — tap to change' },
              ] as { key: 'passportSizePhoto' | 'passportBioPage' | 'visaPage' | 'identityCardFront' | 'identityCardBack' | 'tm30'; docType: DocumentType; icon: IoniconsName; onPick: () => void; hint?: string; uploadedHint?: string }[])
              .map(({ key, docType, icon, onPick, ...rest }) => (
                <DocumentPickerField
                  key={key}
                  label={localeDocumentLabel(docType, locale)}
                  icon={icon}
                  onPress={onPick}
                  isUploaded={form[key] !== null}
                  error={form.errors[key]}
                  accessibilityLabel={`Upload ${localeDocumentLabel(docType, locale)}`}
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
