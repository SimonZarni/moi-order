import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { useEmailOtpScreen } from '@/features/auth/hooks/useEmailOtpScreen';
import { styles } from './EmailOtpScreen.styles';

export function EmailOtpScreen(): React.JSX.Element {
  const {
    step, purpose, email, code, name, errors, bannerError,
    isRequesting, isVerifying, resendSecondsLeft,
    handleEmailChange, handleCodeChange, handleNameChange,
    handleRequestOtp, handleVerifyOtp,
  } = useEmailOtpScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.appLabel}>Immigration Services</Text>
            <Text style={styles.appName}>MOI ORDER</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{purpose === 'login' ? 'Email Sign In' : 'Create Account'}</Text>
            <Text style={styles.cardSubtitle}>{step === 'email' ? 'Enter your email to receive a verification code.' : `Code sent to ${email}`}</Text>
            <ErrorBanner message={bannerError ?? ''} />
            {step === 'email' ? (
              <>
                {purpose === 'register' && (
                  <FormField label="Full Name" value={name} onChangeText={handleNameChange} accessibilityLabel="Full name" error={errors['name']} placeholder="Your full name" autoCapitalize="words" returnKeyType="next" />
                )}
                <FormField label="Email" value={email} onChangeText={handleEmailChange} accessibilityLabel="Email address" error={errors['email']} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="done" onSubmitEditing={handleRequestOtp} />
                <Pressable style={[styles.submitBtn, isRequesting && styles.submitBtnDisabled]} onPress={handleRequestOtp} disabled={isRequesting} accessibilityLabel="Send verification code" accessibilityRole="button">
                  <Text style={styles.submitText}>{isRequesting ? 'Sending…' : 'Send Code'}</Text>
                </Pressable>
              </>
            ) : (
              <>
                <FormField label="Verification Code" value={code} onChangeText={handleCodeChange} accessibilityLabel="6-digit verification code" error={errors['code']} placeholder="000000" keyboardType="number-pad" returnKeyType="done" onSubmitEditing={handleVerifyOtp} />
                <Pressable style={[styles.submitBtn, isVerifying && styles.submitBtnDisabled]} onPress={handleVerifyOtp} disabled={isVerifying} accessibilityLabel="Verify code" accessibilityRole="button">
                  <Text style={styles.submitText}>{isVerifying ? 'Verifying…' : 'Verify'}</Text>
                </Pressable>
                <Pressable style={[styles.resendBtn, (isRequesting || resendSecondsLeft > 0) && styles.resendBtnDisabled]} onPress={handleRequestOtp} disabled={isRequesting || resendSecondsLeft > 0} accessibilityLabel="Resend verification code" accessibilityRole="button">
                  <Text style={styles.resendText}>{resendSecondsLeft > 0 ? `Resend in ${resendSecondsLeft}s` : 'Resend Code'}</Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
