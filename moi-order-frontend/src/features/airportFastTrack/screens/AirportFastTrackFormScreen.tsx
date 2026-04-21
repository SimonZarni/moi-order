import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { SuccessState } from '@/shared/components/SuccessState/SuccessState';
import { useAirportFastTrackFormScreen } from '@/features/airportFastTrack/hooks/useAirportFastTrackFormScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { styles } from './AirportFastTrackFormScreen.styles';

export function AirportFastTrackFormScreen(): React.JSX.Element {
  const {
    form,
    price,
    isSubmitting,
    isSuccess,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handlePickUpperBodyPhoto,
    handlePickAirplaneTicket,
    handleSubmit,
    handleBack,
  } = useAirportFastTrackFormScreen();

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
        <Text style={styles.headerTitle}>Airport Fast Track</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isSuccess ? (
          <SuccessState
            title="Submitted!"
            subtitle={`Your airport fast track request has been submitted.\nWe'll process it and notify you shortly.`}
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
                label={locale === 'mm' ? 'ကိုယ်တစ်ပိုင်းပုံ (လာမည့်နေ့ ဝတ်ဆင်လာမည့် ပုံစံ)' : 'Upper Half Body Photo'}
                icon="camera"
                onPress={handlePickUpperBodyPhoto}
                isUploaded={form.upperBodyPhoto !== null}
                error={form.errors['upperBodyPhoto']}
                hint="Tap to select upper body photo"
                uploadedHint="Photo selected — tap to change"
                accessibilityLabel="Upload upper body photo"
              />

              <DocumentPickerField
                label={locale === 'mm' ? 'လေယာဉ်လက်မှတ်' : 'Airplane Ticket'}
                icon="airplane-outline"
                onPress={handlePickAirplaneTicket}
                isUploaded={form.airplaneTicket !== null}
                error={form.errors['airplaneTicket']}
                hint="Tap to select ticket photo"
                uploadedHint="Ticket selected — tap to change"
                accessibilityLabel="Upload airplane ticket"
              />
            </ScrollView>

            <View style={styles.submitBar}>
              <Pressable
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityLabel={`Submit airport fast track — ${priceFormatted}`}
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
