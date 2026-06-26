import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdateEmailScreen } from '@/features/profile/hooks/useUpdateEmailScreen';
import { styles } from './UpdateEmailScreen.styles';

export function UpdateEmailScreen(): React.JSX.Element {
  const {
    currentEmail,
    isEmailVerified,
    canRemoveEmail,
    verifySent,
    verifyOtp,
    verifyOtpError,
    verifyBannerError,
    verifyExpiresIn,
    isRequestingVerify,
    isVerifying,
    handleRequestVerifyOtp,
    handleVerifyOtpChange,
    handleConfirmVerify,
    email,
    otp,
    emailError,
    otpError,
    bannerError,
    otpSent,
    expiresIn,
    isSendingOtp,
    isUpdating,
    handleEmailChange,
    handleOtpChange,
    handleRequestOtp,
    handleUpdateEmail,
    removeOtp,
    removeOtpError,
    removeBannerError,
    removeSent,
    removeExpiresIn,
    isRequestingRemoval,
    isRemoving,
    handleRequestRemovalOtp,
    handleRemoveOtpChange,
    handleConfirmRemoval,
    handleBack,
  } = useUpdateEmailScreen();

  const canVerifyEmail = currentEmail !== null && !isEmailVerified;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollBg}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Profile</Text>
            <Text style={styles.heroTitle}>Manage Email</Text>
          </View>

          <View style={styles.card}>

            {/* ── Current email status ──────────────────────────────────── */}
            <View style={styles.currentRow}>
              <Text style={styles.currentLabel}>Current email</Text>
              {currentEmail !== null ? (
                <>
                  <Text style={styles.currentEmail} numberOfLines={1}>{currentEmail}</Text>
                  {isEmailVerified ? (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={11} color="#059669" />
                      <Text style={styles.verifiedBadgeText}>Verified</Text>
                    </View>
                  ) : (
                    <View style={styles.unverifiedBadge}>
                      <Ionicons name="alert-circle-outline" size={11} color="#b45309" />
                      <Text style={styles.unverifiedBadgeText}>Unverified</Text>
                    </View>
                  )}
                </>
              ) : (
                <Text style={styles.currentNone}>No email address</Text>
              )}
            </View>

            {/* ── Section 1: Verify ─────────────────────────────────────── */}
            {canVerifyEmail && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionDot, styles.verifyDot]} />
                  <Text style={[styles.sectionTitle, styles.verifyTitle]}>Verify your email</Text>
                </View>
                <Text style={styles.sectionHint}>
                  {verifySent
                    ? `Enter the 6-digit code sent to ${currentEmail} to confirm ownership.`
                    : `Confirm you own ${currentEmail}. We'll send a verification code to that address.`}
                </Text>

                {!!verifyBannerError && (
                  <View style={styles.banner}>
                    <Ionicons name="alert-circle-outline" size={16} color="#c5000f" />
                    <Text style={styles.bannerText}>{verifyBannerError}</Text>
                  </View>
                )}

                {!verifySent ? (
                  <Pressable
                    style={[styles.verifyBtn, isRequestingVerify && styles.verifyBtnDisabled]}
                    onPress={handleRequestVerifyOtp}
                    disabled={isRequestingVerify}
                    accessibilityLabel="Send verification code to current email"
                    accessibilityRole="button"
                  >
                    <Text style={styles.verifyBtnText}>
                      {isRequestingVerify ? 'Sending…' : 'Send Verification Code'}
                    </Text>
                  </Pressable>
                ) : (
                  <View>
                    {verifyExpiresIn !== null && (
                      <Text style={styles.expiryText}>
                        Code expires in {Math.floor(verifyExpiresIn / 60)} minutes
                      </Text>
                    )}
                    <TextInput
                      style={[styles.input, verifyOtpError !== null && styles.inputError]}
                      value={verifyOtp}
                      onChangeText={handleVerifyOtpChange}
                      placeholder="123456"
                      keyboardType="number-pad"
                      maxLength={6}
                      returnKeyType="done"
                      accessibilityLabel="Verification code"
                    />
                    {verifyOtpError !== null && (
                      <Text style={styles.errorText}>{verifyOtpError}</Text>
                    )}
                    <Pressable
                      style={[styles.verifyConfirmBtn, isVerifying && styles.verifyConfirmBtnDisabled]}
                      onPress={handleConfirmVerify}
                      disabled={isVerifying}
                      accessibilityLabel="Confirm email verification"
                      accessibilityRole="button"
                    >
                      <Text style={styles.verifyConfirmBtnText}>
                        {isVerifying ? 'Verifying…' : 'Verify Email'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}

            {canVerifyEmail && <View style={styles.divider} />}

            {/* ── Section 2: Update ─────────────────────────────────────── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, styles.updateDot]} />
                <Text style={[styles.sectionTitle, styles.updateTitle]}>
                  {currentEmail !== null ? 'Change email' : 'Add email'}
                </Text>
              </View>
              <Text style={styles.sectionHint}>
                {currentEmail !== null
                  ? 'Switch to a different email address. A code will be sent to the new address to confirm ownership.'
                  : 'Add an email address and password to enable email login.'}
              </Text>

              {!!bannerError && (
                <View style={styles.banner}>
                  <Ionicons name="alert-circle-outline" size={16} color="#c5000f" />
                  <Text style={styles.bannerText}>{bannerError}</Text>
                </View>
              )}

              <Text style={styles.label}>New email address</Text>
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
                accessibilityLabel="Send code to new email"
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
                  <Text style={styles.otpHint}>
                    Enter the 6-digit code sent to{' '}
                    <Text style={{ fontWeight: '600' }}>{email.trim().toLowerCase()}</Text>.
                  </Text>
                  <TextInput
                    style={[styles.input, otpError !== null && styles.inputError]}
                    value={otp}
                    onChangeText={handleOtpChange}
                    placeholder="123456"
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    accessibilityLabel="Email update verification code"
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
            </View>

            {/* ── Section 3: Remove ─────────────────────────────────────── */}
            {canRemoveEmail && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, styles.removeDot]} />
                    <Text style={[styles.sectionTitle, styles.removeTitle]}>Remove email</Text>
                  </View>
                  <Text style={styles.sectionHint}>
                    {removeSent
                      ? `Enter the code sent to ${currentEmail} to confirm removal. Your email and password login will be permanently deleted.`
                      : `Remove ${currentEmail} from your account. Your password login will also be removed. Another login method (phone, Google, Apple, or LINE) is required.`}
                  </Text>

                  {!!removeBannerError && (
                    <View style={styles.banner}>
                      <Ionicons name="alert-circle-outline" size={16} color="#c5000f" />
                      <Text style={styles.bannerText}>{removeBannerError}</Text>
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
                      {removeOtpError !== null && (
                        <Text style={styles.errorText}>{removeOtpError}</Text>
                      )}
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
              </>
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
