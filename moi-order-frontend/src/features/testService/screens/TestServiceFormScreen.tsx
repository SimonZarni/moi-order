import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { useTestServiceFormScreen } from '@/features/testService/hooks/useTestServiceFormScreen';
import { styles } from './TestServiceFormScreen.styles';

export function TestServiceFormScreen(): React.JSX.Element {
  const {
    form,
    price,
    isSubmitting,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handlePickPhoto,
    handleSubmit,
    handleBack,
  } = useTestServiceFormScreen();

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
        <Text style={styles.headerTitle}>Test Service</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
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
            placeholder="Enter your full name"
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

          <Text style={styles.sectionTitle}>Photo</Text>

          <DocumentPickerField
            label="Photo"
            icon="🖼️"
            onPress={handlePickPhoto}
            isUploaded={form.photo !== null}
            error={form.errors['photo']}
            hint="Tap to select a photo"
            uploadedHint="Photo selected — tap to change"
            accessibilityLabel="Upload photo"
          />
        </ScrollView>

        <View style={styles.submitBar}>
          <Pressable
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityLabel={`Submit test service — ${priceFormatted}`}
            accessibilityRole="button"
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? 'Submitting…' : `Submit · ${priceFormatted}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
