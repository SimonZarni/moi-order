import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdateEmailScreen } from '@/features/profile/hooks/useUpdateEmailScreen';
import { styles } from './UpdateEmailScreen.styles';

export function UpdateEmailScreen(): React.JSX.Element {
  const {
    email, otp, emailError, otpError, bannerError,
    otpSent, isSendingOtp, isUpdating,
    handleEmailChange, handleOtpChange,
    handleRequestOtp, handleUpdateEmail, handleBack,
  } = useUpdateEmailScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Profile</Text>
            <Text style={styles.heroTitle}>Update Email</Text>
          </View>

          <View style={styles.card}>
            {!!bannerError && (
              <View style={styles.banner}>
                <Ionicons name="alert-circle-outline" size={16} color="#c5000f" />
                <Text style={styles.bannerText}>{bannerError}</Text>
              </View>
            )}

            <Text style={styles.label}>New email address</Text>
            <Text style={styles.hint}>
              Enter your new email address. We'll send a 6-digit verification code to confirm ownership.
            </Text>

            <TextInput
              style={[styles.input, emailError !== null && styles.inputError]}
              value={email}
              onChangeText={handleEmailChange}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="done"
              accessibilityLabel="New email address"
            />
            {emailError !== null && <Text style={styles.errorText}>{emailError}</Text>}

            <Pressable
              style={[styles.sendBtn, isSendingOtp && styles.sendBtnDisabled]}
              onPress={handleRequestOtp}
              disabled={isSendingOtp}
              accessibilityLabel="Send verification code"
              accessibilityRole="button"
            >
              <Text style={styles.sendBtnText}>
                {isSendingOtp ? 'Sending…' : otpSent ? 'Resend Code' : 'Send Code'}
              </Text>
            </Pressable>

            {otpSent && (
              <View style={styles.otpSection}>
                <Text style={styles.otpLabel}>Verification code</Text>
                <Text style={styles.otpHint}>
                  Enter the 6-digit code sent to <Text style={{ fontWeight: '600' }}>{email.trim().toLowerCase()}</Text>.
                </Text>

                <TextInput
                  style={[styles.input, otpError !== null && styles.inputError]}
                  value={otp}
                  onChangeText={handleOtpChange}
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  accessibilityLabel="Verification code"
                />
                {otpError !== null && <Text style={styles.errorText}>{otpError}</Text>}

                <Pressable
                  style={[styles.confirmBtn, isUpdating && styles.confirmBtnDisabled]}
                  onPress={handleUpdateEmail}
                  disabled={isUpdating}
                  accessibilityLabel="Confirm email update"
                  accessibilityRole="button"
                >
                  <Text style={styles.confirmBtnText}>
                    {isUpdating ? 'Updating…' : 'Confirm Update'}
                  </Text>
                </Pressable>
              </View>
            )}

            <Pressable
              style={styles.backRow}
              onPress={handleBack}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Text style={styles.backLink}>← Go back</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
