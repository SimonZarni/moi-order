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
import { useLoginScreen } from '@/features/auth/hooks/useLoginScreen';
import { styles } from './LoginScreen.styles';

export function LoginScreen(): React.JSX.Element {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const {
    form,
    step,
    isCheckingEmail,
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
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    handlePhoneNumberChange,
    handleOtpCodeChange,
    handleTogglePassword,
    handleContinue,
    handleBackToEmail,
    handleSubmit,
    handleRequestOtp,
    handleVerifyOtp,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToRegister,
    handleGoToForgotPassword,
  } = useLoginScreen();

  const socialDisabled = isCheckingEmail || isSubmitting || isGoogleSigningIn || isAppleSigningIn || isLineSigningIn;

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
            <Text style={styles.tagline}>Fast · Reliable · Trusted</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>Welcome back — let's get you in.</Text>

            <AuthMethodTabs value={authMethod} onChange={setAuthMethod} />
            <ErrorBanner message={bannerError} />

            {authMethod === 'email' ? (
              <>
                {step === 'email' ? (
                  <>
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
                      onSubmitEditing={handleContinue}
                    />
                    <Pressable
                      style={[styles.submitBtn, isCheckingEmail && styles.submitBtnDisabled]}
                      onPress={handleContinue}
                      disabled={isCheckingEmail}
                      accessibilityLabel="Continue"
                      accessibilityRole="button"
                    >
                      <Text style={styles.submitText}>{isCheckingEmail ? 'Checking…' : 'Continue'}</Text>
                    </Pressable>

                    <Pressable
                      style={styles.forgotBtn}
                      onPress={handleGoToForgotPassword}
                      accessibilityLabel="Forgot password"
                      accessibilityRole="button"
                    >
                      <Text style={styles.forgotText}>Forgot password?</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <View style={styles.emailRow}>
                      <Text style={styles.emailDisplay}>{form.email}</Text>
                      <Pressable
                        style={styles.backBtn}
                        onPress={handleBackToEmail}
                        accessibilityLabel="Back to email"
                        accessibilityRole="button"
                      >
                        <Text style={styles.backText}>← back</Text>
                      </Pressable>
                    </View>

                    <FormField
                      label="Password"
                      value={form.password}
                      onChangeText={handlePasswordChange}
                      accessibilityLabel="Password"
                      error={form.errors['password']}
                      placeholder="••••••••"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      rightElement={
                        <Pressable
                          style={styles.eyeBtn}
                          onPress={handleTogglePassword}
                          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                          accessibilityRole="button"
                        >
                          <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                        </Pressable>
                      }
                    />

                    <Pressable
                      style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                      accessibilityLabel="Sign in"
                      accessibilityRole="button"
                    >
                      <Text style={styles.submitText}>{isSubmitting ? 'Signing in…' : 'Sign In'}</Text>
                    </Pressable>

                    <Pressable
                      style={styles.forgotBtn}
                      onPress={handleGoToForgotPassword}
                      accessibilityLabel="Forgot password"
                      accessibilityRole="button"
                    >
                      <Text style={styles.forgotText}>Forgot password?</Text>
                    </Pressable>
                  </>
                )}

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or social sign-in</Text>
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
                  label="Thai Phone Number"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  accessibilityLabel="Thai phone number"
                  placeholder="0812345678"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />

                <Text style={styles.otpHint}>Use SMS OTP for quick sign in on iPhone and Android.</Text>

                <FormField
                  label="Verification Code"
                  value={otpCode}
                  onChangeText={handleOtpCodeChange}
                  accessibilityLabel="Verification code"
                  placeholder="6-digit code"
                  keyboardType="number-pad"
                  returnKeyType="done"
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
                    accessibilityLabel="Verify SMS code"
                    accessibilityRole="button"
                  >
                    <Text style={styles.otpButtonText}>{isVerifyingOtp ? 'Checking…' : 'Continue'}</Text>
                  </Pressable>
                </View>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable
                onPress={handleGoToRegister}
                accessibilityLabel="Create account"
                accessibilityRole="button"
              >
                <Text style={styles.footerLink}>Create Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
