import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEmailVerification } from '../hooks/useEmailVerification';
import { styles } from './EmailVerificationScreen.styles';
import { colours } from '../../../shared/theme/colours';

interface EmailVerificationScreenProps {
  email: string;
  onBack: () => void;
  onDone: () => void;
}

export function EmailVerificationScreen({
  email,
  onBack,
  onDone,
}: EmailVerificationScreenProps): React.JSX.Element {
  const {
    step, otp, password, passwordConfirm, error, resendAfter,
    setOtp, setPassword, setPasswordConfirm,
    handleSendOtp, handleConfirm,
  } = useEmailVerification();

  if (step === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneContainer}>
          <View style={styles.doneIcon}>
            <Ionicons name="checkmark-circle" size={56} color={colours.primary} />
          </View>
          <Text style={styles.doneTitle}>Email Verified</Text>
          <Text style={styles.doneSubtitle}>
            Your email is verified and your new password is set. You can now log in with your own credentials.
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={onDone}
            accessibilityLabel="Continue"
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Verify Email</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.infoBox}>
          <Ionicons name="mail-outline" size={20} color={colours.primary} />
          <Text style={styles.infoText}>
            We will send a 6-digit verification code to{' '}
            <Text style={styles.infoEmail}>{email}</Text>
          </Text>
        </View>

        {error !== null && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color={colours.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {step === 'idle' && (
          <Pressable
            style={styles.primaryBtn}
            onPress={handleSendOtp}
            accessibilityLabel="Send verification code"
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Send Verification Code</Text>
          </Pressable>
        )}

        {step === 'sending' && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colours.primary} />
            <Text style={styles.loadingText}>Sending code…</Text>
          </View>
        )}

        {(step === 'entering_otp' || step === 'confirming') && (
          <>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>VERIFICATION CODE</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="000000"
                placeholderTextColor={colours.textSubtle}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                accessibilityLabel="6-digit verification code"
              />
              {resendAfter > 0 && (
                <Text style={styles.resendHint}>
                  Resend available after {resendAfter}s
                </Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum 8 characters"
                placeholderTextColor={colours.textSubtle}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                accessibilityLabel="New password"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor={colours.textSubtle}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry
                accessibilityLabel="Confirm password"
              />
            </View>

            <Pressable
              style={[styles.primaryBtn, step === 'confirming' && styles.primaryBtnDisabled]}
              onPress={handleConfirm}
              disabled={step === 'confirming'}
              accessibilityLabel="Verify and set password"
              accessibilityRole="button"
            >
              {step === 'confirming'
                ? <ActivityIndicator color={colours.backgroundDark} />
                : <Text style={styles.primaryBtnText}>Verify & Set Password</Text>}
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
