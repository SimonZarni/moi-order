import React from 'react';
import {
  Alert, Pressable, RefreshControl,
  ScrollView, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { ProfileSkeleton } from '@/features/profile/components/ProfileSkeleton';
import { useProfileScreen } from '@/features/profile/hooks/useProfileScreen';
import { formatDate } from '@/shared/utils/formatDate';
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
    name, dateOfBirth, profileErrors, isDirty, isSavingProfile, showDatePicker,
    currentPassword, newPassword, confirmPassword, passwordErrors,
    isPasswordSectionOpen, isChangingPassword,
    handleNameChange, handleDateFieldPress, handleDatePickerChange, handleSaveProfile, handleRefresh,
    handleTogglePasswordSection,
    handleCurrentPasswordChange, handleNewPasswordChange, handleConfirmPasswordChange,
    handleChangePassword,
    handleGoToOrders, handleLogout,
  } = useProfileScreen();

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
            <Text style={styles.sectionLabel}>Personal Info</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            {/* Name */}
            <View style={styles.inputRow}>
              <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                <Text style={styles.iconEmoji}>👤</Text>
              </View>
              <TextInput
                style={[styles.inputField, profileErrors.name !== null && styles.inputError]}
                value={name}
                onChangeText={handleNameChange}
                placeholder="Full name"
                placeholderTextColor={colours.textMuted}
                autoCapitalize="words"
                returnKeyType="done"
                accessibilityLabel="Full name"
              />
            </View>
            {profileErrors.name !== null && (
              <Text style={styles.errorText}>{profileErrors.name}</Text>
            )}

            {/* Date of birth */}
            <View style={[styles.inputRow, { marginTop: 4 }]}>
              <View style={[styles.iconBadge, styles.iconBadgePrimary]}>
                <Text style={styles.iconEmoji}>🎂</Text>
              </View>
              <Pressable
                style={{ flex: 1 }}
                onPress={handleDateFieldPress}
                accessibilityLabel="Select date of birth"
                accessibilityRole="button"
              >
                <Text style={[styles.dobValue, dateOfBirth === null && styles.dobPlaceholder]}>
                  {dateOfBirth !== null ? formatDate(dateOfBirth.toISOString()) : 'Date of birth'}
                </Text>
              </Pressable>
            </View>
            {profileErrors.dateOfBirth !== null && (
              <Text style={styles.errorText}>{profileErrors.dateOfBirth}</Text>
            )}

            {/* Native date picker */}
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

            {/* Save button — shown only when form is dirty */}
            {isDirty && (
              <Pressable
                style={styles.saveBtn}
                onPress={handleSaveProfile}
                disabled={isSavingProfile}
                accessibilityLabel="Save profile changes"
                accessibilityRole="button"
              >
                <Text style={styles.saveBtnText}>
                  {isSavingProfile ? 'Saving…' : 'Save Changes'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* § Activity */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Activity</Text>
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
                <Text style={styles.iconEmoji}>📋</Text>
              </View>
              <Text style={styles.rowLabel}>My Orders</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
          </View>

          {/* § Security */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Security</Text>
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
                <Text style={styles.iconEmoji}>🔐</Text>
              </View>
              <Text style={styles.rowLabel}>Change Password</Text>
              <Text style={styles.rowChevron}>{isPasswordSectionOpen ? '↑' : '›'}</Text>
            </Pressable>

            {isPasswordSectionOpen && (
              <View style={styles.passwordForm}>
                <TextInput
                  style={[styles.passwordInput, passwordErrors.currentPassword !== null && styles.passwordInputError]}
                  value={currentPassword}
                  onChangeText={handleCurrentPasswordChange}
                  placeholder="Current password"
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
                  placeholder="New password"
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
                  placeholder="Confirm new password"
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
                    {isChangingPassword ? 'Updating…' : 'Update Password'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* § Legal */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Legal</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => Alert.alert('Coming Soon', 'Privacy Policy will be available in a future update.')}
              accessibilityLabel="Privacy Policy"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Text style={styles.iconEmoji}>📄</Text>
              </View>
              <Text style={styles.rowLabel}>Privacy Policy</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
            <View style={styles.rowSeparator} />
            <Pressable
              style={styles.row}
              onPress={() => Alert.alert('Coming Soon', 'Terms & Conditions will be available in a future update.')}
              accessibilityLabel="Terms and Conditions"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Text style={styles.iconEmoji}>📜</Text>
              </View>
              <Text style={styles.rowLabel}>Terms & Conditions</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
            <View style={styles.rowSeparator} />
            <Pressable
              style={styles.row}
              onPress={() => Alert.alert('Coming Soon', 'Personal Data Protection Act information will be available in a future update.')}
              accessibilityLabel="Personal Data Protection Act"
              accessibilityRole="button"
            >
              <View style={[styles.iconBadge, styles.iconBadgeTeal]}>
                <Text style={styles.iconEmoji}>🛡️</Text>
              </View>
              <Text style={styles.rowLabel}>Personal Data Protection Act</Text>
              <Text style={styles.rowChevron}>›</Text>
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
