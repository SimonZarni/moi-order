import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdatePhoneScreen } from '@/features/profile/hooks/useUpdatePhoneScreen';
import { styles } from './UpdatePhoneScreen.styles';

export function UpdatePhoneScreen(): React.JSX.Element {
  const {
    phoneNumber, otp, phoneError, otpError, bannerError,
    otpRequestId, isSendingOtp, isUpdating,
    handlePhoneChange, handleOtpChange,
    handleRequestOtp, handleUpdatePhone, handleBack,
  } = useUpdatePhoneScreen();

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
            <Text style={styles.heroTitle}>Update Phone</Text>
          </View>

          <View style={styles.card}>
            {!!bannerError && (
              <View style={styles.banner}>
                <Ionicons name="alert-circle-outline" size={16} color="#c5000f" />
                <Text style={styles.bannerText}>{bannerError}</Text>
              </View>
            )}

            <Text style={styles.label}>New phone number</Text>
            <Text style={styles.hint}>Enter your Thai mobile number. We'll send a 6-digit verification code.</Text>

            <TextInput
              style={[styles.input, phoneError !== null && styles.inputError]}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              placeholder="0812345678"
              keyboardType="phone-pad"
              autoCapitalize="none"
              returnKeyType="done"
              accessibilityLabel="New phone number"
            />
            {phoneError !== null && <Text style={styles.errorText}>{phoneError}</Text>}

            <Pressable
              style={[styles.sendBtn, isSendingOtp && styles.sendBtnDisabled]}
              onPress={handleRequestOtp}
              disabled={isSendingOtp}
              accessibilityLabel="Send verification code"
              accessibilityRole="button"
            >
              <Text style={styles.sendBtnText}>
                {isSendingOtp ? 'Sending…' : otpRequestId ? 'Resend Code' : 'Send Code'}
              </Text>
            </Pressable>

            {otpRequestId !== null && (
              <View style={styles.otpSection}>
                <Text style={styles.otpLabel}>Verification code</Text>
                <Text style={styles.otpHint}>Enter the 6-digit code sent to your phone.</Text>

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
                  onPress={handleUpdatePhone}
                  disabled={isUpdating}
                  accessibilityLabel="Confirm phone update"
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
