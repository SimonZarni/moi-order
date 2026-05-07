import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { AppleSignInButton } from '@/shared/components/AppleSignInButton/AppleSignInButton';
import { AuthMethod, AuthMethodTabs } from '@/shared/components/AuthMethodTabs/AuthMethodTabs';
import { FormField } from '@/shared/components/FormField/FormField';
import { GoogleSignInButton } from '@/shared/components/GoogleSignInButton/GoogleSignInButton';
import { LineSignInButton } from '@/shared/components/LineSignInButton/LineSignInButton';
import { useRegisterScreen } from '@/features/auth/hooks/useRegisterScreen';
import { styles } from './RegisterScreen.styles';

export function RegisterScreen(): React.JSX.Element {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const {
    form,
    isSubmitting,
    isGoogleSigningIn,
    isAppleSigningIn,
    isLineSigningIn,
    isRequestingOtp,
    isVerifyingOtp,
    resendSecondsLeft,
    phoneNumber,
    otpCode,
    bannerError,
    handleNameChange,
    handleEmailChange,
    handlePhoneNumberChange,
    handleOtpCodeChange,
    handleSubmit,
    handleRequestOtp,
    handleVerifyOtp,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToLogin,
  } = useRegisterScreen();

  const socialDisabled = isSubmitting || isGoogleSigningIn || isAppleSigningIn || isLineSigningIn;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Image
              source={require('../../../../assets/splash-icon.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Moi Order logo"
            />
            <Text style={styles.welcomeText}>Welcome</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardSubtitle}>Join thousands who trust MOI Order.</Text>

            <AuthMethodTabs value={authMethod} onChange={setAuthMethod} />
            <ErrorBanner message={bannerError} />

            {authMethod === 'email' ? (
              <>
                <FormField
                  label="Full Name"
                  value={form.name}
                  onChangeText={handleNameChange}
                  accessibilityLabel="Full name"
                  error={form.errors['name']}
                  placeholder="John Doe"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />

                <FormField
                  label="Email"
                  value={form.email}
                  onChangeText={handleEmailChange}
                  accessibilityLabel="Email address"
                  error={form.errors['email']}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />

                <Pressable
                  style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  accessibilityLabel="Send verification code"
                  accessibilityRole="button"
                >
                  <Text style={styles.submitText}>{isSubmitting ? 'Sending…' : 'Send Code'}</Text>
                </Pressable>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or social sign-up</Text>
                  <View style={styles.dividerLine} />
                </View>

                <GoogleSignInButton
                  onPress={handleGoogleSignIn}
                  isLoading={isGoogleSigningIn}
                  disabled={socialDisabled}
                />

                <View style={styles.socialButtonSpacing}>
                  <LineSignInButton
                    onPress={handleLineSignIn}
                    isLoading={isLineSigningIn}
                    disabled={socialDisabled}
                  />
                </View>

                {Platform.OS === 'ios' && (
                  <View style={styles.socialButtonSpacing}>
                    <AppleSignInButton
                      onPress={handleAppleSignIn}
                      isLoading={isAppleSigningIn}
                      disabled={socialDisabled}
                    />
                  </View>
                )}
              </>
            ) : (
              <>
                <FormField
                  label="Full Name"
                  value={form.name}
                  onChangeText={handleNameChange}
                  accessibilityLabel="Full name"
                  error={form.errors['name']}
                  placeholder="John Doe"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />

                <FormField
                  label="Thai Phone Number"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  accessibilityLabel="Thai phone number"
                  placeholder="0812345678"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />

                <Text style={styles.otpHint}>Request an SMS code to create an account with your phone number.</Text>

                <FormField
                  label="Verification Code"
                  value={otpCode}
                  onChangeText={handleOtpCodeChange}
                  accessibilityLabel="Verification code"
                  placeholder="6-digit code"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={handleVerifyOtp}
                />

                <View style={styles.otpRow}>
                  <Pressable
                    style={[
                      styles.otpButton,
                      styles.otpButtonSecondary,
                      (isRequestingOtp || resendSecondsLeft > 0) && styles.otpButtonDisabled,
                    ]}
                    onPress={handleRequestOtp}
                    disabled={isRequestingOtp || resendSecondsLeft > 0}
                    accessibilityLabel="Send SMS code"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.otpButtonText, styles.otpButtonTextSecondary]}>
                      {isRequestingOtp ? 'Sending…' : resendSecondsLeft > 0 ? `Resend in ${resendSecondsLeft}s` : 'Send OTP'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.otpButton, isVerifyingOtp && styles.otpButtonDisabled]}
                    onPress={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    accessibilityLabel="Create account with OTP"
                    accessibilityRole="button"
                  >
                    <Text style={styles.otpButtonText}>{isVerifyingOtp ? 'Checking…' : 'Create with OTP'}</Text>
                  </Pressable>
                </View>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable
                onPress={handleGoToLogin}
                accessibilityLabel="Sign in"
                accessibilityRole="button"
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
