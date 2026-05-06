import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEmailOtpScreen } from '@/features/auth/hooks/useEmailOtpScreen';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { styles } from './EmailOtpScreen.styles';

export function EmailOtpScreen(): React.JSX.Element {
  const {
    form, email, isVerifying, isResending, resendSecondsLeft, bannerError,
    handleOtpChange, handleVerify, handleResend, handleBack,
  } = useEmailOtpScreen();

  const canResend = resendSecondsLeft === 0 && !isResending;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Moi Order</Text>
            <Text style={styles.heroTitle}>Check your email</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.hint}>
              We sent a 6-digit code to{' '}
              <Text style={styles.emailHighlight}>{email}</Text>.
              {'\n'}It expires in 10 minutes.
            </Text>
            <ErrorBanner message={bannerError} />
            <FormField label="Verification Code" value={form.otp} onChangeText={handleOtpChange}
              accessibilityLabel="6-digit verification code" error={form.errors['otp']}
              placeholder="000000" keyboardType="number-pad" returnKeyType="done"
              onSubmitEditing={handleVerify} />
            <Pressable style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
              onPress={handleVerify} disabled={isVerifying}
              accessibilityLabel="Verify code" accessibilityRole="button">
              <Text style={styles.verifyText}>{isVerifying ? 'Verifying…' : 'Verify Code'}</Text>
            </Pressable>
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive it?</Text>
              <Pressable onPress={handleResend} disabled={!canResend}
                accessibilityLabel="Resend verification code" accessibilityRole="button">
                <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                  {isResending ? ' Sending…' : resendSecondsLeft > 0 ? ` Resend in ${resendSecondsLeft}s` : ' Resend'}
                </Text>
              </Pressable>
            </View>
            <View style={styles.backRow}>
              <Pressable onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
                <Text style={styles.backLink}>← Go back</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
