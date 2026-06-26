import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdateEmailScreen } from '@/features/profile/hooks/useUpdateEmailScreen';
import { styles } from './UpdateEmailScreen.styles';

export function UpdateEmailScreen(): React.JSX.Element {
  const {
    email, otp, emailError, otpError, bannerError,
    otpSent, expiresIn, isSendingOtp, isUpdating,
    handleEmailChange, handleOtpChange,
    handleRequestOtp, handleUpdateEmail, handleBack,
    canRemoveEmail, currentEmail,
    removeOtp, removeOtpError, removeBannerError,
    removeSent, removeExpiresIn,
    isRequestingRemoval, isRemoving,
    handleRequestRemovalOtp, handleRemoveOtpChange, handleConfirmRemoval,
  } = useUpdateEmailScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollBg} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
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

            {otpSent && expiresIn !== null && (
              <Text style={styles.expiryText}>
                Code expires in {Math.floor(expiresIn / 60)} minutes
              </Text>
            )}

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

            {canRemoveEmail && (
              <View style={styles.removeSection}>
                <Text style={styles.removeTitle}>Remove email</Text>
                <Text style={styles.removeHint}>
                  {removeSent
                    ? `Enter the code sent to ${currentEmail ?? ''} to confirm. Your email and password login will be permanently removed.`
                    : `Remove ${currentEmail ?? ''} from your account. Email login and password will also be removed. You must have another login method (phone, Google, Apple, or LINE) to proceed.`}
                </Text>

                {!!removeBannerError && (
                  <View style={styles.removeBanner}>
                    <Ionicons name="alert-circle-outline" size={16} color="#c5000f" />
                    <Text style={styles.removeBannerText}>{removeBannerError}</Text>
                  </View>
                )}

                {!removeSent ? (
                  <Pressable
                    style={[styles.removeBtn, isRequestingRemoval && styles.removeBtnDisabled]}
                    onPress={handleRequestRemovalOtp}
                    disabled={isRequestingRemoval}
                    accessibilityLabel="Send removal verification code"
                    accessibilityRole="button"
                  >
                    <Text style={styles.removeBtnText}>
                      {isRequestingRemoval ? 'Sending…' : 'Send Removal Code'}
                    </Text>
                  </Pressable>
                ) : (
                  <View>
                    {removeExpiresIn !== null && (
                      <Text style={styles.expiryText}>
                        Code expires in {Math.floor(removeExpiresIn / 60)} minutes
                      </Text>
                    )}
                    <TextInput
                      style={[styles.input, removeOtpError !== null && styles.inputError]}
                      value={removeOtp}
                      onChangeText={handleRemoveOtpChange}
                      placeholder="123456"
                      keyboardType="number-pad"
                      maxLength={6}
                      returnKeyType="done"
                      accessibilityLabel="Removal verification code"
                    />
                    {removeOtpError !== null && <Text style={styles.errorText}>{removeOtpError}</Text>}

                    <Pressable
                      style={[styles.removeConfirmBtn, isRemoving && styles.removeConfirmBtnDisabled]}
                      onPress={handleConfirmRemoval}
                      disabled={isRemoving}
                      accessibilityLabel="Confirm email removal"
                      accessibilityRole="button"
                    >
                      <Text style={styles.removeConfirmBtnText}>
                        {isRemoving ? 'Removing…' : 'Confirm Removal'}
                      </Text>
                    </Pressable>
                  </View>
                )}
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
