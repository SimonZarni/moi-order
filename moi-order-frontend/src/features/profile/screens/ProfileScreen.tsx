import React from 'react';
import {
  Pressable, RefreshControl,
  ScrollView, Text, TextInput, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { ProfileSkeleton } from '@/features/profile/components/ProfileSkeleton';
import { useProfileScreen } from '@/features/profile/hooks/useProfileScreen';
import { formatDate } from '@/shared/utils/formatDate';
import { getProfileStrings } from '@/shared/constants/profileStrings';
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
    name, dateOfBirth, profileErrors, isDirty, isSavingProfile, showDatePicker, isEditingProfile,
    currentPassword, newPassword, confirmPassword, passwordErrors,
    isPasswordSectionOpen, isChangingPassword,
    locale, handleSetLocale,
    handleToggleEditProfile,
    handleNameChange, handleDateFieldPress, handleDatePickerChange, handleSaveProfile, handleRefresh,
    handleTogglePasswordSection,
    handleCurrentPasswordChange, handleNewPasswordChange, handleConfirmPasswordChange,
    handleChangePassword,
    handleGoToOrders, handleGoToPrivacyPolicy, handleGoToTerms, handleGoToPdpa, handleLogout,
  } = useProfileScreen();

  const t = getProfileStrings(locale);

  if (isLoading) {
    return (
      <>
        <ProfileSkeleton />
        <FloatingTabBar />
      </>
    );
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
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.heroName}>{user?.name ?? name}</Text>
          <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>
          {user !== null && <Text style={styles.heroSince}>{memberSince}</Text>}
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>

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

                {/* Read-only date of birth row */}
                <View style={styles.infoRow}>
                  <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                    <Ionicons name="gift-outline" size={16} color={colours.primary} />
                  </View>
                  <Text style={[styles.infoValue, dateOfBirth === null && styles.infoPlaceholder]}>
                    {dateOfBirth !== null ? formatDate(dateOfBirth.toISOString()) : 'Not set'}
                  </Text>
                </View>
              </>
            )}
          </View>

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
                  English
                </Text>
              </Pressable>
              <Pressable
                style={[styles.langBtn, locale === 'mm' && styles.langBtnActive]}
                onPress={() => handleSetLocale('mm')}
                accessibilityLabel="Switch to Burmese"
                accessibilityRole="button"
              >
                <Text style={[styles.langBtnText, locale === 'mm' && styles.langBtnTextActive]}>
                  မြန်မာ
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

          {/* § Security */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{t.security}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={handleTogglePasswordSection}
              accessibilityLabel="Change password"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeSlate]}>
                <Ionicons name="lock-closed-outline" size={16} color={colours.medium} />
              </View>
              <Text style={styles.rowLabel}>{t.changePassword}</Text>
              <Ionicons name={isPasswordSectionOpen ? 'chevron-up' : 'chevron-forward'} size={18} color={colours.textMuted} />
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

          {/* § Sign Out */}
          <Pressable
            style={styles.signOutBtn}
            onPress={handleLogout}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>

        </View>
      </ScrollView>
      <FloatingTabBar />
    </SafeAreaView>
  );
}
