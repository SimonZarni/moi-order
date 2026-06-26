import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable, RefreshControl,
  ScrollView, Text, TextInput, View,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Application from 'expo-application';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ProfileSkeleton } from '@/features/profile/components/ProfileSkeleton';
import { DocumentShortcuts } from '@/features/profile/components/DocumentShortcuts';
import { useProfileScreen } from '@/features/profile/hooks/useProfileScreen';
import { useLinkedAccounts } from '@/features/profile/hooks/useLinkedAccounts';
import { useUploadStats } from '@/features/documents/hooks/useUploadStats';
import { useVerificationStatus } from '@/features/profile/hooks/useVerificationStatus';
import { VerifiedBadgeIcon } from '@/shared/components/VerifiedBadgeIcon';
import { LINE_OA_URL } from '@/shared/constants/config';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPhoneNumber } from '@/shared/utils/formatPhoneNumber';
import { getProfileStrings } from '@/shared/constants/profileStrings';
import { useStrings } from '@/shared/i18n';
import { colours } from '@/shared/theme/colours';
import { styles } from './ProfileScreen.styles';

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export function ProfileScreen(): React.JSX.Element {
  const {
    user, isLoading, isRefreshing,
    name, dateOfBirth, lineHandle, profileErrors, isDirty, isSavingProfile, showDatePicker, isEditingProfile,
    displayEmail, displayPhone,
    needsEmailCompletion, isPlaceholderEmail, hasPassword,
    currentPassword, newPassword, confirmPassword, passwordErrors,
    isPasswordSectionOpen, isChangingPassword,
    locale, handleSetLocale,
    handleToggleEditProfile,
    handleNameChange, handleLineHandleChange, handleDateFieldPress, handleDatePickerChange, handleSaveProfile, handleRefresh,
    handleTogglePasswordSection,
    handleCurrentPasswordChange, handleNewPasswordChange, handleConfirmPasswordChange,
    handleChangePassword,
    handleGoToOrders, handleGoToMoiVerified, handleGoToBecomeMerchant, handleGoToMerchantMenu, handleGoToPrivacyPolicy, handleGoToTerms, handleGoToPdpa,
    handleGoToForgotPassword, handleLogout,
    handleDeleteAccount, isDeletingAccount,
    handleUpdatePhone, handleUpdateEmail,
    isUploadingPicture, isRemovingPicture, handleAvatarPress,
    realThaiDate, simulatedDate, isUpdatingSimulatedDate, showSimulatedDatePicker,
    handleSimulatedDateFieldPress, handleSimulatedDatePickerChange, handleClearSimulatedDate,
    isTriggeringReminder, lastTriggerResult, handleTriggerReminder,
    handleCheckVersion,
  } = useProfileScreen();
  const {
    isLinkingGoogle, isLinkingApple, isLinkingLine,
    isUnlinkingGoogle, isUnlinkingApple, isUnlinkingLine,
    linkError,
    handleLinkGoogle, handleLinkApple, handleLinkLine,
    handleUnlinkGoogle, handleUnlinkApple, handleUnlinkLine,
    dismissLinkError,
  } = useLinkedAccounts();

  const { stats } = useUploadStats();
  const { status: verificationStatus } = useVerificationStatus();
  const t = getProfileStrings(locale);
  const s = useStrings();
  const hasPhoneNumber = displayPhone !== null;
  const appleUnavailable = Platform.OS !== 'ios';

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const initials   = getInitials(user?.name ?? name);
  const memberSince = user ? `Member since ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : '';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.tertiary} />
        }
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.orbA} />
          <View style={styles.orbB} />
          <View style={styles.orbC} />

          <View style={styles.avatarRing}>
            <Pressable
              style={styles.avatar}
              onPress={handleAvatarPress}
              disabled={isUploadingPicture || isRemovingPicture}
              accessibilityLabel="Change profile picture"
              accessibilityRole="button"
            >
              {user?.profile_picture_url ? (
                <Image
                  source={{ uri: user.profile_picture_url }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </Pressable>
            <View style={styles.avatarCameraOverlay} pointerEvents="none">
              {isUploadingPicture || isRemovingPicture
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="camera" size={12} color="#fff" />
              }
            </View>
          </View>

          <View style={styles.heroNameRow}>
            <Text style={styles.heroName}>{user?.name ?? name}</Text>
            {user?.is_privileged
              ? <FontAwesome5 name="crown" size={22} color="#F59E0B" />
              : verificationStatus?.is_verified && <VerifiedBadgeIcon size={26} />
            }
          </View>
          <Text style={styles.heroEmail}>{displayEmail ?? '—'}</Text>
          {user !== null && <Text style={styles.heroSince}>{memberSince}</Text>}
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {needsEmailCompletion && (
            <View style={styles.emailPromptCard}>
              <View style={styles.emailPromptHeader}>
                <View style={[styles.iconBadge, styles.iconBadgeAmber]}>
                  <Ionicons name="mail-open-outline" size={16} color={colours.secondary} />
                </View>
                <View style={styles.emailPromptCopy}>
                  <Text style={styles.emailPromptTitle}>{s.profile.addEmail}</Text>
                  <Text style={styles.emailPromptText}>{s.profile.addEmailDesc}</Text>
                </View>
              </View>
              <Pressable
                style={styles.emailPromptButton}
                onPress={handleUpdateEmail}
                accessibilityLabel="Add email address"
                accessibilityRole="button"
              >
                <Text style={styles.emailPromptButtonText}>Add Email</Text>
              </Pressable>
            </View>
          )}

          {!!linkError && (
            <View style={styles.linkErrorCard}>
              <Ionicons name="alert-circle-outline" size={16} color={colours.danger} />
              <Text style={styles.linkErrorText}>{linkError}</Text>
              <Pressable
                onPress={dismissLinkError}
                style={styles.linkErrorDismiss}
                accessibilityLabel="Dismiss error"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={16} color={colours.danger} />
              </Pressable>
            </View>
          )}

          {/* § Document shortcuts */}
          <DocumentShortcuts stats={stats} />

          {/* § Moi Verified */}
          <Pressable
            style={styles.card}
            onPress={handleGoToMoiVerified}
            accessibilityLabel={s.profile.becomeVerified}
            accessibilityRole="button"
          >
            <View style={styles.row}>
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colours.tertiary} />
              </View>
              <Text style={[styles.rowLabel, styles.rowLabelBold]}>{s.profile.becomeVerified}</Text>
              <VerifiedBadgeIcon size={20} />
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </View>
          </Pressable>

          {/* § Merchant Account */}
          <Pressable
            style={styles.card}
            onPress={handleGoToBecomeMerchant}
            accessibilityLabel={user?.is_merchant ? s.profile.merchantApproved : s.profile.becomeMerchant}
            accessibilityRole="button"
          >
            <View style={styles.row}>
              <View style={[styles.iconBadge, styles.iconBadgeAmber]}>
                <Ionicons name="storefront-outline" size={16} color={colours.secondary} />
              </View>
              <Text style={[styles.rowLabel, styles.rowLabelBold]}>
                {user?.is_merchant ? s.profile.merchantApproved : s.profile.becomeMerchant}
              </Text>
              {user?.is_merchant ? (
                <View style={styles.approvedBadge}>
                  <Text style={styles.approvedBadgeText}>{s.profile.approvedBadge}</Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
              )}
            </View>
          </Pressable>

          {/* § Personal Info */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{t.personalInfo}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            {/* Icon button — absolutely positioned so it adds zero vertical space */}
            <Pressable
              style={styles.editIconBtn}
              onPress={handleToggleEditProfile}
              accessibilityLabel={isEditingProfile ? 'Cancel editing profile' : 'Edit profile'}
              accessibilityRole="button"
            >
              <Ionicons name={isEditingProfile ? 'close' : 'pencil'} size={14} color={colours.primary} />
            </Pressable>

            {isEditingProfile ? (
              <>
                {/* Name input */}
                <View style={styles.inputRow}>
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="person" size={16} color={colours.primary} />
                  </View>
                  <TextInput
                    style={[styles.inputField, profileErrors.name !== null && styles.inputError]}
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder={t.fullNamePlaceholder}
                    placeholderTextColor={colours.textMuted}
                    autoCapitalize="words"
                    returnKeyType="done"
                    accessibilityLabel="Full name"
                  />
                </View>
                {profileErrors.name !== null && (
                  <Text style={styles.errorText}>{profileErrors.name}</Text>
                )}

                {/* Date of birth input */}
                <View style={[styles.inputRow, { marginTop: 4 }]}>
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="gift-outline" size={16} color={colours.primary} />
                  </View>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={handleDateFieldPress}
                    accessibilityLabel="Select date of birth"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.dobValue, dateOfBirth === null && styles.dobPlaceholder]}>
                      {dateOfBirth !== null ? formatDate(dateOfBirth.toISOString()) : t.dobPlaceholder}
                    </Text>
                  </Pressable>
                </View>
                {profileErrors.dateOfBirth !== null && (
                  <Text style={styles.errorText}>{profileErrors.dateOfBirth}</Text>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth ?? new Date(2000, 0, 1)}
                    mode="date"
                    display="default"
                    onChange={handleDatePickerChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                  />
                )}

                {/* LINE ID input (optional — user can leave blank to keep or clear) */}
                <View style={[styles.inputRow, { marginTop: 4 }]}>
                  <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={colours.tertiary} />
                  </View>
                  <TextInput
                    style={[styles.inputField, profileErrors.lineHandle !== null && styles.inputError]}
                    value={lineHandle}
                    onChangeText={handleLineHandleChange}
                    placeholder="LINE ID (e.g. chrisline)"
                    placeholderTextColor={colours.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    accessibilityLabel="LINE ID"
                  />
                </View>
                {profileErrors.lineHandle !== null && (
                  <Text style={styles.errorText}>{profileErrors.lineHandle}</Text>
                )}

                {isDirty && (
                  <Pressable
                    style={styles.saveBtn}
                    onPress={handleSaveProfile}
                    disabled={isSavingProfile}
                    accessibilityLabel="Save profile changes"
                    accessibilityRole="button"
                  >
                    <Text style={styles.saveBtnText}>
                      {isSavingProfile ? 'Saving…' : t.saveChanges}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                {/* Read-only name row */}
                <View style={styles.infoRow}>
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="person" size={16} color={colours.primary} />
                  </View>
                  <Text style={styles.infoValue}>{name || '—'}</Text>
                </View>

                {/* Tappable email row → UpdateEmailScreen */}
                <Pressable
                  style={styles.infoRow}
                  onPress={handleUpdateEmail}
                  accessibilityLabel={displayEmail ? 'Update email address' : 'Add email address'}
                  accessibilityRole="button"
                >
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="mail-outline" size={16} color={colours.primary} />
                  </View>
                  <Text style={[styles.infoValue, displayEmail === null && styles.infoPlaceholder, { flex: 1 }]}>
                    {displayEmail ?? '—'}
                  </Text>
                  {displayEmail !== null && user?.email_verified_at === null && (
                    <View style={styles.unverifiedBadge}>
                      <Ionicons name="alert-circle-outline" size={11} color={colours.warning} />
                      <Text style={styles.unverifiedBadgeText}>Unverified</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
                </Pressable>

                {/* Tappable phone row → UpdatePhoneScreen */}
                <Pressable
                  style={styles.infoRow}
                  onPress={handleUpdatePhone}
                  accessibilityLabel={displayPhone ? 'Update phone number' : 'Add phone number'}
                  accessibilityRole="button"
                >
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="call-outline" size={16} color={colours.primary} />
                  </View>
                  <Text style={[styles.infoValue, displayPhone === null && styles.infoPlaceholder, { flex: 1 }]}>
                    {displayPhone ? formatPhoneNumber(displayPhone) : '—'}
                  </Text>
                  {displayPhone !== null && user?.phone_verified_at === null && (
                    <View style={styles.unverifiedBadge}>
                      <Ionicons name="alert-circle-outline" size={11} color={colours.warning} />
                      <Text style={styles.unverifiedBadgeText}>Unverified</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
                </Pressable>

                {/* Read-only date of birth row */}
                <View style={styles.infoRow}>
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="gift-outline" size={16} color={colours.primary} />
                  </View>
                  <Text style={[styles.infoValue, dateOfBirth === null && styles.infoPlaceholder]}>
                    {dateOfBirth !== null ? formatDate(dateOfBirth.toISOString()) : 'Not set'}
                  </Text>
                </View>

                {/* Read-only LINE ID row */}
                <View style={styles.infoRow}>
                  <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={colours.tertiary} />
                  </View>
                  <Text style={[styles.infoValue, user?.line_handle === null && styles.infoPlaceholder]}>
                    {user?.line_handle ? `@${user.line_handle}` : 'LINE ID not set'}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* § Linked Accounts */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{s.profile.linkedAccounts}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <View style={styles.linkRow}>
              <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                <Ionicons name="logo-google" size={16} color={colours.primary} />
              </View>
              <View style={styles.linkCopy}>
                <Text style={styles.linkTitle}>Google</Text>
                <Text style={styles.linkSubtitle}>
                  {user?.has_google ? s.profile.alreadyConnected : s.profile.useGoogleLater}
                </Text>
              </View>
              <View style={styles.linkActions}>
                {user?.has_google && (
                  <Pressable
                    style={styles.unlinkBtn}
                    onPress={handleUnlinkGoogle}
                    disabled={isUnlinkingGoogle || isLinkingGoogle}
                    accessibilityLabel="Unlink Google account"
                    accessibilityRole="button"
                  >
                    <Ionicons name="remove-circle-outline" size={22} color={colours.danger} />
                  </Pressable>
                )}
                <Pressable
                  style={[styles.linkBtn, user?.has_google ? styles.linkBtnConnected : styles.linkBtnPrimary]}
                  onPress={handleLinkGoogle}
                  disabled={isLinkingGoogle || isUnlinkingGoogle}
                  accessibilityLabel={user?.has_google ? 'Reconnect Google account' : 'Link Google account'}
                  accessibilityRole="button"
                >
                  <Text style={[styles.linkBtnText, user?.has_google && styles.linkBtnTextConnected]}>
                    {isUnlinkingGoogle ? 'Unlinking…' : isLinkingGoogle ? 'Linking…' : (user?.has_google ? 'Reconnect' : 'Connect')}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.rowSeparator} />
            <View style={styles.linkRow}>
              <View style={[styles.iconBadge, styles.iconBadgeSlate]}>
                <Ionicons name="logo-apple" size={16} color={colours.medium} />
              </View>
              <View style={styles.linkCopy}>
                <Text style={styles.linkTitle}>Apple</Text>
                <Text style={styles.linkSubtitle}>
                  {appleUnavailable
                    ? 'Available on iPhone and iPad only'
                    : (user?.has_apple ? s.profile.alreadyConnected : s.profile.useAppleLater)}
                </Text>
              </View>
              <View style={styles.linkActions}>
                {user?.has_apple && !appleUnavailable && (
                  <Pressable
                    style={styles.unlinkBtn}
                    onPress={handleUnlinkApple}
                    disabled={isUnlinkingApple || isLinkingApple}
                    accessibilityLabel="Unlink Apple account"
                    accessibilityRole="button"
                  >
                    <Ionicons name="remove-circle-outline" size={22} color={colours.danger} />
                  </Pressable>
                )}
                <Pressable
                  style={[
                    styles.linkBtn,
                    user?.has_apple ? styles.linkBtnConnected : styles.linkBtnPrimary,
                    appleUnavailable && styles.linkBtnDisabled,
                  ]}
                  onPress={handleLinkApple}
                  disabled={isLinkingApple || isUnlinkingApple || appleUnavailable}
                  accessibilityLabel={user?.has_apple ? 'Reconnect Apple account' : 'Link Apple account'}
                  accessibilityRole="button"
                >
                  <Text style={[styles.linkBtnText, user?.has_apple && styles.linkBtnTextConnected]}>
                    {appleUnavailable ? 'iOS only' : isUnlinkingApple ? 'Unlinking…' : isLinkingApple ? 'Linking…' : (user?.has_apple ? 'Reconnect' : 'Connect')}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.rowSeparator} />
            <View style={styles.linkRow}>
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={colours.tertiary} />
              </View>
              <View style={styles.linkCopy}>
                <Text style={styles.linkTitle}>LINE</Text>
                <Text style={styles.linkSubtitle}>
                  {user?.has_line ? s.profile.alreadyConnected : s.profile.useLineLater}
                </Text>
              </View>
              <View style={styles.linkActions}>
                {user?.has_line && (
                  <Pressable
                    style={styles.unlinkBtn}
                    onPress={handleUnlinkLine}
                    disabled={isUnlinkingLine || isLinkingLine}
                    accessibilityLabel="Unlink LINE account"
                    accessibilityRole="button"
                  >
                    <Ionicons name="remove-circle-outline" size={22} color={colours.danger} />
                  </Pressable>
                )}
                <Pressable
                  style={[styles.linkBtn, user?.has_line ? styles.linkBtnConnected : styles.linkBtnPrimary]}
                  onPress={handleLinkLine}
                  disabled={isLinkingLine || isUnlinkingLine}
                  accessibilityLabel={user?.has_line ? 'Reconnect LINE account' : 'Link LINE account'}
                  accessibilityRole="button"
                >
                  <Text style={[styles.linkBtnText, user?.has_line && styles.linkBtnTextConnected]}>
                    {isUnlinkingLine ? 'Unlinking…' : isLinkingLine ? 'Linking…' : (user?.has_line ? 'Reconnect' : 'Connect')}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.rowSeparator} />
            <View style={styles.linkRow}>
              <View style={[styles.iconBadge, styles.iconBadgeAmber]}>
                <Ionicons name="call-outline" size={16} color={colours.secondary} />
              </View>
              <View style={styles.linkCopy}>
                <Text style={styles.linkTitle}>Phone</Text>
                <Text style={styles.linkSubtitle}>
                  {hasPhoneNumber && displayPhone ? `Linked: ${formatPhoneNumber(displayPhone)}` : s.profile.addThaiPhone}
                </Text>
              </View>
              <Pressable
                style={[styles.linkBtn, hasPhoneNumber ? styles.linkBtnConnected : styles.linkBtnPrimary]}
                onPress={handleUpdatePhone}
                accessibilityLabel={hasPhoneNumber ? 'Update phone number' : 'Add phone number'}
                accessibilityRole="button"
              >
                <Text style={[styles.linkBtnText, hasPhoneNumber && styles.linkBtnTextConnected]}>
                  {hasPhoneNumber ? 'Update' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* § Security */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{t.security}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={[styles.row, !hasPassword && styles.rowDisabled]}
              onPress={hasPassword ? handleTogglePasswordSection : undefined}
              disabled={!hasPassword}
              accessibilityLabel={hasPassword ? 'Change password' : 'Change password (not available — no password set)'}
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeSlate]}>
                <Ionicons name="lock-closed-outline" size={16} color={hasPassword ? colours.medium : colours.textMuted} />
              </View>
              <Text style={[styles.rowLabel, !hasPassword && styles.rowLabelDisabled]}>{t.changePassword}</Text>
              <Ionicons
                name={hasPassword ? (isPasswordSectionOpen ? 'chevron-up' : 'chevron-forward') : 'lock-closed'}
                size={hasPassword ? 18 : 14}
                color={colours.textMuted}
              />
            </Pressable>

            {isPasswordSectionOpen && (
              <View style={styles.passwordForm}>
                <TextInput
                  style={[styles.passwordInput, passwordErrors.currentPassword !== null && styles.passwordInputError]}
                  value={currentPassword}
                  onChangeText={handleCurrentPasswordChange}
                  placeholder={t.currentPassword}
                  placeholderTextColor={colours.textMuted}
                  secureTextEntry
                  accessibilityLabel="Current password"
                />
                {passwordErrors.currentPassword !== null && (
                  <Text style={styles.passwordErrorText}>{passwordErrors.currentPassword}</Text>
                )}

                <TextInput
                  style={[styles.passwordInput, passwordErrors.newPassword !== null && styles.passwordInputError]}
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
                  placeholder={t.newPassword}
                  placeholderTextColor={colours.textMuted}
                  secureTextEntry
                  accessibilityLabel="New password"
                />
                {passwordErrors.newPassword !== null && (
                  <Text style={styles.passwordErrorText}>{passwordErrors.newPassword}</Text>
                )}

                <TextInput
                  style={[styles.passwordInput, passwordErrors.confirmPassword !== null && styles.passwordInputError]}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholder={t.confirmNewPassword}
                  placeholderTextColor={colours.textMuted}
                  secureTextEntry
                  accessibilityLabel="Confirm new password"
                />
                {passwordErrors.confirmPassword !== null && (
                  <Text style={styles.passwordErrorText}>{passwordErrors.confirmPassword}</Text>
                )}

                <Pressable
                  style={styles.updatePasswordBtn}
                  onPress={handleChangePassword}
                  disabled={isChangingPassword}
                  accessibilityLabel="Update password"
                  accessibilityRole="button"
                >
                  <Text style={styles.updatePasswordBtnText}>
                    {isChangingPassword ? 'Updating…' : t.updatePassword}
                  </Text>
                </Pressable>
              </View>
            )}

            {hasPassword && (
              <Pressable
                style={styles.forgotPasswordRow}
                onPress={handleGoToForgotPassword}
                accessibilityLabel="Forgot password"
                accessibilityRole="button"
              >
                <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
              </Pressable>
            )}
          </View>

          {/* § Test Controls — privileged accounts only */}
          {user?.is_privileged && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Test Controls</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.card}>
                {/* Real date row */}
                <View style={styles.infoRow}>
                  <View style={[styles.iconBadge, styles.iconBadgeSlate]}>
                    <Ionicons name="globe-outline" size={16} color={colours.medium} />
                  </View>
                  <View style={styles.simulatedDateInfo}>
                    <Text style={styles.simulatedDateLabel}>Real date (Thai time)</Text>
                    <Text style={styles.simulatedDateValue}>{formatDate(realThaiDate)}</Text>
                  </View>
                </View>

                <View style={styles.rowSeparator} />

                {/* Active / simulated date row */}
                <View style={styles.infoRow}>
                  <View style={[styles.iconBadge, simulatedDate !== null ? styles.iconBadgeAmber : styles.iconBadgeSlate]}>
                    <Ionicons name="calendar-outline" size={16} color={simulatedDate !== null ? colours.secondary : colours.medium} />
                  </View>
                  <View style={styles.simulatedDateInfo}>
                    <Text style={styles.simulatedDateLabel}>
                      {simulatedDate !== null ? 'Simulated date (active)' : 'System date'}
                    </Text>
                    <Text style={[styles.simulatedDateValue, simulatedDate !== null && styles.simulatedDateActive]}>
                      {simulatedDate !== null ? formatDate(simulatedDate) : formatDate(realThaiDate)}
                    </Text>
                  </View>
                </View>

                {/* Set / Reset buttons */}
                <View style={styles.simulatedDateActions}>
                  {simulatedDate !== null && (
                    <Pressable
                      style={styles.clearDateBtn}
                      onPress={handleClearSimulatedDate}
                      disabled={isUpdatingSimulatedDate}
                      accessibilityLabel="Reset to real Thai date"
                      accessibilityRole="button"
                    >
                      <Text style={styles.clearDateBtnText}>Reset</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.setDateBtn}
                    onPress={handleSimulatedDateFieldPress}
                    disabled={isUpdatingSimulatedDate}
                    accessibilityLabel="Set simulated date for testing"
                    accessibilityRole="button"
                  >
                    <Text style={styles.setDateBtnText}>
                      {isUpdatingSimulatedDate ? 'Saving…' : 'Set Date'}
                    </Text>
                  </Pressable>
                </View>

                {showSimulatedDatePicker && (
                  <DateTimePicker
                    value={simulatedDate !== null ? new Date(`${simulatedDate}T00:00:00`) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleSimulatedDatePickerChange}
                  />
                )}

                <View style={styles.rowSeparator} />

                {/* Test notification trigger */}
                <Pressable
                  style={[styles.triggerBtn, isTriggeringReminder && styles.triggerBtnDisabled]}
                  onPress={handleTriggerReminder}
                  disabled={isTriggeringReminder}
                  accessibilityLabel="Send test 90-day reminder notification"
                  accessibilityRole="button"
                >
                  <Ionicons name="notifications-outline" size={15} color={colours.tertiary} />
                  <Text style={styles.triggerBtnText}>
                    {isTriggeringReminder ? 'Sending…' : 'Send Test Notification'}
                  </Text>
                </Pressable>

                {/* Diagnostic result */}
                {lastTriggerResult !== null && (
                  <View style={styles.triggerResult}>
                    {/* Document */}
                    <View style={styles.diagRow}>
                      <Ionicons
                        name={lastTriggerResult.has_document ? 'checkmark-circle' : 'close-circle'}
                        size={14}
                        color={lastTriggerResult.has_document ? colours.success : colours.danger}
                      />
                      <Text style={styles.triggerResultText}>
                        {lastTriggerResult.has_document
                          ? `90-day document found — ${lastTriggerResult.days_remaining} days remaining (date used: ${lastTriggerResult.effective_date})`
                          : 'No valid 90-day document found for this account'}
                      </Text>
                    </View>
                    {/* Device token */}
                    <View style={styles.diagRow}>
                      <Ionicons
                        name={lastTriggerResult.device_token_count > 0 ? 'checkmark-circle' : 'close-circle'}
                        size={14}
                        color={lastTriggerResult.device_token_count > 0 ? colours.success : colours.danger}
                      />
                      <Text style={styles.triggerResultText}>
                        {lastTriggerResult.device_token_count > 0
                          ? `${lastTriggerResult.device_token_count} device token(s) registered — push was attempted`
                          : 'No device token registered — push cannot be sent (re-open the app or re-login)'}
                      </Text>
                    </View>
                    {/* Notification sent */}
                    {lastTriggerResult.has_document && lastTriggerResult.device_token_count > 0 && (
                      <View style={styles.diagRow}>
                        <Ionicons name="notifications" size={14} color={colours.tertiary} />
                        <Text style={styles.triggerResultText}>
                          Notification dispatched to Expo — check your device. If nothing arrives, the push delivery system needs investigating.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </>
          )}

          {/* § Language */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{t.language}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <View style={styles.langRow}>
              <Pressable
                style={[styles.langBtn, locale === 'en' && styles.langBtnActive]}
                onPress={() => handleSetLocale('en')}
                accessibilityLabel="Switch to English"
                accessibilityRole="button"
              >
                <Text style={[styles.langBtnText, locale === 'en' && styles.langBtnTextActive]}>
                  {s.profile.english}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.langBtn, locale === 'mm' && styles.langBtnActive]}
                onPress={() => handleSetLocale('mm')}
                accessibilityLabel="Switch to Burmese"
                accessibilityRole="button"
              >
                <Text style={[styles.langBtnText, locale === 'mm' && styles.langBtnTextActive]}>
                  {s.profile.burmese}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.langBtn, locale === 'th' && styles.langBtnActive]}
                onPress={() => handleSetLocale('th')}
                accessibilityLabel="Switch to Thai"
                accessibilityRole="button"
              >
                <Text style={[styles.langBtnText, locale === 'th' && styles.langBtnTextActive]}>
                  {s.profile.thai}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* § Activity */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{t.activity}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={handleGoToOrders}
              accessibilityLabel="My Orders"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeAmber]}>
                <Ionicons name="list" size={16} color={colours.secondary} />
              </View>
              <Text style={styles.rowLabel}>{t.myOrders}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
          </View>

          {/* § Customer Support */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{s.profile.customerSupport}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => Linking.openURL('https://www.facebook.com/moiorder')}
              accessibilityLabel={s.profile.contactFacebook}
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeFacebook]}>
                <Ionicons name="logo-facebook" size={16} color="#1877F2" />
              </View>
              <Text style={styles.rowLabel}>{s.profile.contactFacebook}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
            <View style={styles.rowSeparator} />
            <Pressable
              style={styles.row}
              onPress={() => Linking.openURL(LINE_OA_URL)}
              accessibilityLabel={s.profile.contactLine}
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeLine]}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#06C755" />
              </View>
              <Text style={styles.rowLabel}>{s.profile.contactLine}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
          </View>

          {/* § Legal */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{t.legal}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={handleGoToPrivacyPolicy}
              accessibilityLabel="Privacy Policy"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Ionicons name="document-text-outline" size={16} color={colours.tertiary} />
              </View>
              <Text style={styles.rowLabel}>{t.privacyPolicy}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
            <View style={styles.rowSeparator} />
            <Pressable
              style={styles.row}
              onPress={handleGoToTerms}
              accessibilityLabel="Terms and Conditions"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Ionicons name="reader-outline" size={16} color={colours.tertiary} />
              </View>
              <Text style={styles.rowLabel}>{t.termsConditions}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
            <View style={styles.rowSeparator} />
            <Pressable
              style={styles.row}
              onPress={handleGoToPdpa}
              accessibilityLabel="Personal Data Protection Act"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colours.tertiary} />
              </View>
              <Text style={styles.rowLabel}>{t.pdpa}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
          </View>

          {/* § Version */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>App</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={handleCheckVersion}
              accessibilityLabel="Check app version"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                <Ionicons name="information-circle-outline" size={16} color={colours.primary} />
              </View>
              <Text style={styles.rowLabel}>App Version</Text>
              <Text style={styles.rowValue}>{Application.nativeApplicationVersion ?? '—'}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
            </Pressable>
          </View>

          {/* § Sign Out */}
          <Pressable
            style={styles.signOutBtn}
            onPress={handleLogout}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
          >
            <Text style={styles.signOutText}>{s.profile.signOut}</Text>
          </Pressable>

          {/* § Delete Account */}
          <Pressable
            style={styles.deleteAccountBtn}
            onPress={handleDeleteAccount}
            disabled={isDeletingAccount}
            accessibilityLabel="Delete account"
            accessibilityRole="button"
          >
            <Text style={styles.deleteAccountText}>
              {isDeletingAccount ? s.common.cancelling : s.profile.deleteAccount}
            </Text>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
