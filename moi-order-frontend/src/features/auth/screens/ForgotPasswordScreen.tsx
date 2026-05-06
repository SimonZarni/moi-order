import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useForgotPasswordScreen } from '@/features/auth/hooks/useForgotPasswordScreen';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { styles } from './ForgotPasswordScreen.styles';

export function ForgotPasswordScreen(): React.JSX.Element {
  const { form, isSending, bannerError, handleEmailChange, handleSendOtp, handleBack } =
    useForgotPasswordScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Moi Order</Text>
            <Text style={styles.heroTitle}>Forgot Password</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send a 6-digit code.{'\n'}
              Works for social login accounts too.
            </Text>
            <ErrorBanner message={bannerError} />
            <FormField label="Email" value={form.email} onChangeText={handleEmailChange}
              accessibilityLabel="Email address" error={form.errors['email']}
              placeholder="you@example.com" keyboardType="email-address"
              autoCapitalize="none" autoComplete="email" returnKeyType="done"
              onSubmitEditing={handleSendOtp} />
            <Pressable style={[styles.submitBtn, isSending && styles.submitBtnDisabled]}
              onPress={handleSendOtp} disabled={isSending}
              accessibilityLabel="Send reset code" accessibilityRole="button">
              <Text style={styles.submitText}>{isSending ? 'Sending…' : 'Send Reset Code'}</Text>
            </Pressable>
            <View style={styles.backRow}>
              <Pressable onPress={handleBack} accessibilityLabel="Back to sign in" accessibilityRole="button">
                <Text style={styles.backLink}>← Back to Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
