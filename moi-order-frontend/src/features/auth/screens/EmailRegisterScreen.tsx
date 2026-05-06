import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEmailRegisterScreen } from '@/features/auth/hooks/useEmailRegisterScreen';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { styles } from './EmailRegisterScreen.styles';

export function EmailRegisterScreen(): React.JSX.Element {
  const {
    form, isSending, bannerError,
    handleNameChange, handleEmailChange, handleSendOtp, handleBack,
  } = useEmailRegisterScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Moi Order</Text>
            <Text style={styles.heroTitle}>Create Account</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Register with Email</Text>
            <Text style={styles.subtitle}>We'll send a 6-digit code to verify your email.</Text>
            <ErrorBanner message={bannerError} />
            <FormField label="Full Name" value={form.name} onChangeText={handleNameChange}
              accessibilityLabel="Full name" error={form.errors['name']}
              placeholder="Your full name" autoCapitalize="words" returnKeyType="next" />
            <FormField label="Email" value={form.email} onChangeText={handleEmailChange}
              accessibilityLabel="Email address" error={form.errors['email']}
              placeholder="you@example.com" keyboardType="email-address"
              autoCapitalize="none" autoComplete="email" returnKeyType="done"
              onSubmitEditing={handleSendOtp} />
            <Pressable style={[styles.submitBtn, isSending && styles.submitBtnDisabled]}
              onPress={handleSendOtp} disabled={isSending}
              accessibilityLabel="Send verification code" accessibilityRole="button">
              <Text style={styles.submitText}>{isSending ? 'Sending…' : 'Send Verification Code'}</Text>
            </Pressable>
            <View style={styles.backRow}>
              <Text style={styles.backText}>Already have an account?</Text>
              <Pressable onPress={handleBack} accessibilityLabel="Back to sign in" accessibilityRole="button">
                <Text style={styles.backLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
