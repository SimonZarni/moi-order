import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useEmbassyVisaRecommendationFormScreen } from '@/features/embassyVisaRecommendation/hooks/useEmbassyVisaRecommendationFormScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeDocumentLabel } from '@/shared/utils/localeName';
import { DOCUMENT_TYPE, DocumentType } from '@/types/enums';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
import { styles } from './EmbassyVisaRecommendationFormScreen.styles';

export function EmbassyVisaRecommendationFormScreen(): React.JSX.Element {
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
    handleSubmit,
    handleBack,
  } = useEmbassyVisaRecommendationFormScreen();

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
        <Text style={styles.headerTitle}>Visa Recommendation</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isSuccess ? (
          <SuccessState
            title="Submitted!"
            subtitle={`Your visa recommendation request has been submitted.\nWe'll process it and notify you shortly.`}
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
                { key: 'passportBioPage'   as const, docType: DOCUMENT_TYPE.PassportBioPage,   icon: 'document-text' as const, onPick: handlePickPassportBioPage },
                { key: 'visaPage'          as const, docType: DOCUMENT_TYPE.VisaPage,          icon: 'id-card' as const,       onPick: handlePickVisaPage },
                { key: 'identityCardFront' as const, docType: DOCUMENT_TYPE.IdentityCardFront, icon: 'id-card' as const,       onPick: handlePickIdentityCardFront },
                { key: 'identityCardBack'  as const, docType: DOCUMENT_TYPE.IdentityCardBack,  icon: 'id-card' as const,       onPick: handlePickIdentityCardBack },
              ] as { key: 'passportBioPage' | 'visaPage' | 'identityCardFront' | 'identityCardBack'; docType: DocumentType; icon: IoniconsName; onPick: () => void }[])
              .map(({ key, docType, icon, onPick }) => (
                <DocumentPickerField
                  key={key}
                  label={localeDocumentLabel(docType, locale)}
                  icon={icon}
                  onPress={onPick}
                  isUploaded={form[key] !== null}
                  error={form.errors[key]}
                  accessibilityLabel={`Upload ${localeDocumentLabel(docType, locale)}`}
                />
              ))}
            </ScrollView>

            <View style={styles.submitBar}>
              <Pressable
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityLabel={`Submit visa recommendation — ${priceFormatted}`}
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
