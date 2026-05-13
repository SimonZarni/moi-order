import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useProfileData } from '@/features/profile/hooks/useProfileData';
import { TriggerReminderResult } from '@/shared/api/profile';
import { useProfileForm } from '@/features/profile/hooks/useProfileForm';
import { useChangePasswordForm } from '@/features/profile/hooks/useChangePasswordForm';
import { useProfilePicture } from '@/features/profile/hooks/useProfilePicture';
import { unregisterDeviceToken } from '@/shared/api/deviceTokens';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { useLocale } from '@/shared/hooks/useLocale';
import { Locale } from '@/shared/store/localeStore';
import { RootStackParamList } from '@/types/navigation';
import { User } from '@/types/models';

export interface UseProfileScreenResult {
  // Data
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  // Simulated date (privileged accounts only)
  realThaiDate: string;
  simulatedDate: string | null;
  isUpdatingSimulatedDate: boolean;
  showSimulatedDatePicker: boolean;
  handleSimulatedDateFieldPress: () => void;
  handleSimulatedDatePickerChange: (event: DateTimePickerEvent, date?: Date) => void;
  handleClearSimulatedDate: () => void;
  // Test trigger (privileged accounts only)
  isTriggeringReminder: boolean;
  lastTriggerResult: TriggerReminderResult | null;
  handleTriggerReminder: () => void;
  // Profile form
  name: string;
  dateOfBirth: Date | null;
  profileErrors: ReturnType<typeof useProfileForm>['errors'];
  isDirty: boolean;
  isSavingProfile: boolean;
  showDatePicker: boolean;
  isEditingProfile: boolean;
  displayEmail: string | null;
  displayPhone: string | null;
  needsEmailCompletion: boolean;
  isPlaceholderEmail: boolean;
  hasPassword: boolean;
  // Change password form
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordErrors: ReturnType<typeof useChangePasswordForm>['errors'];
  isPasswordSectionOpen: boolean;
  isChangingPassword: boolean;
  // Handlers — profile
  handleToggleEditProfile: () => void;
  handleNameChange: (text: string) => void;
  handleDateFieldPress: () => void;
  handleDatePickerChange: (event: DateTimePickerEvent, date?: Date) => void;
  handleSaveProfile: () => void;
  handleRefresh: () => void;
  // Handlers — password
  handleTogglePasswordSection: () => void;
  handleCurrentPasswordChange: (text: string) => void;
  handleNewPasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;
  handleChangePassword: () => void;
  // Language
  locale: Locale;
  handleSetLocale: (locale: Locale) => void;
  // Handlers — nav
  handleGoToOrders: () => void;
  handleGoToMoiVerified: () => void;
  handleGoToPrivacyPolicy: () => void;
  handleGoToTerms: () => void;
  handleGoToPdpa: () => void;
  handleGoToForgotPassword: () => void;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
  isDeletingAccount: boolean;
  handleUpdatePhone: () => void;
  handleUpdateEmail: () => void;
  // Profile picture
  isUploadingPicture: boolean;
  isRemovingPicture: boolean;
  handleAvatarPress: () => void;
  // App version check
  handleCheckVersion: () => void;
}

export function useProfileScreen(): UseProfileScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn);
  const clearAuth   = useAuthStore((s) => s.clearAuth);
  const pushToken    = useNotificationStore((s) => s.pushToken);
  const resetUnread  = useNotificationStore((s) => s.resetUnread);
  const { locale, setLocale } = useLocale();

  const { user, isLoading, isRefreshing, refetch, updateMutation, changePasswordMutation, deleteAccountMutation, simulatedDateMutation, triggerReminderMutation } = useProfileData();
  const profileForm        = useProfileForm(user);
  const changePasswordForm = useChangePasswordForm();
  const pictureMethods     = useProfilePicture(user);

  const [showDatePicker, setShowDatePicker]               = useState(false);
  const [showSimulatedDatePicker, setShowSimulatedDatePicker] = useState(false);
  const [lastTriggerResult, setLastTriggerResult]             = useState<TriggerReminderResult | null>(null);
  const [isPasswordSectionOpen, setPasswordSection]       = useState(false);
  const [isEditingProfile, setIsEditingProfile]           = useState(false);

  const isPlaceholderEmail = ((): boolean => {
    const email = user?.email;
    if (email == null) return true;
    return email.endsWith('@users.moiorder.local') || email.endsWith('@deleted.invalid');
  })();
  // OTP users have phone_{number}@users.moiorder.local — they have phone as login method so no warning needed.
  // Social users (line_, google_, apple_ prefix) do need to add a real email.
  const needsEmailCompletion = isPlaceholderEmail && !(user?.email?.startsWith('phone_') ?? false);
  const hasPassword          = user?.has_password ?? false;
  // Show null/placeholder emails as null so the UI can display "—"
  const displayEmail = isPlaceholderEmail ? null : (user?.email ?? null);
  const displayPhone = (user?.phone_number ?? '').trim() !== '' ? user!.phone_number : null;

  // Guard: navigate to Home when unauthenticated.
  // Guests cannot reach this screen via the tab bar (FloatingTabBar redirects them
  // to Login), so this effect fires only after a logout clears the session.
  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Home');
    }
  }, [isLoggedIn, navigation]);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  // ── Profile form handlers ───────────────────────────────────────────────

  const handleToggleEditProfile = useCallback((): void => {
    setIsEditingProfile((prev) => {
      if (prev && user) {
        // Cancelling — reset form back to server values
        profileForm.resetToUser(user);
        setShowDatePicker(false);
      }
      return !prev;
    });
  }, [profileForm, user]);

  const handleDateFieldPress = useCallback((): void => {
    setShowDatePicker(true);
  }, []);

  const handleDatePickerChange = useCallback((event: DateTimePickerEvent, date?: Date): void => {
    // Android auto-closes; on iOS keep open until selection is confirmed
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed') { setShowDatePicker(false); return; }
    if (event.type === 'set' && date) {
      profileForm.handleDateChange(date);
      setShowDatePicker(false); // close on both platforms after confirm
    }
  }, [profileForm]);

  const handleSaveProfile = useCallback((): void => {
    if (!profileForm.validate()) return;

    const dobStr = profileForm.dateOfBirth
      ? [
          profileForm.dateOfBirth.getFullYear(),
          String(profileForm.dateOfBirth.getMonth() + 1).padStart(2, '0'),
          String(profileForm.dateOfBirth.getDate()).padStart(2, '0'),
        ].join('-')
      : null;

    updateMutation.mutate(
      {
        name:        profileForm.name.trim(),
        email:       user?.email ?? '',
        phoneNumber: user?.phone_number ?? null,
        dateOfBirth: dobStr,
      },
      {
        onSuccess: () => setIsEditingProfile(false),
        onError:   (err) => profileForm.applyApiError(err),
      },
    );
  }, [profileForm, updateMutation, user]);

  // ── Password handlers ───────────────────────────────────────────────────

  const handleTogglePasswordSection = useCallback((): void => {
    setPasswordSection((prev) => {
      if (prev) changePasswordForm.reset();
      return !prev;
    });
  }, [changePasswordForm]);

  const handleChangePassword = useCallback((): void => {
    if (!changePasswordForm.validate()) return;

    changePasswordMutation.mutate(
      {
        currentPassword: changePasswordForm.currentPassword,
        newPassword:     changePasswordForm.newPassword,
        confirmPassword: changePasswordForm.confirmPassword,
      },
      {
        onSuccess: () => {
          changePasswordForm.reset();
          setPasswordSection(false);
          Alert.alert('Password Updated', 'Your password has been changed successfully.');
        },
        onError: (err) => changePasswordForm.applyApiError(err),
      },
    );
  }, [changePasswordForm, changePasswordMutation]);

  // ── Simulated date (privileged only) ────────────────────────────────────

  const handleSimulatedDateFieldPress = useCallback((): void => {
    setShowSimulatedDatePicker(true);
  }, []);

  const handleSimulatedDatePickerChange = useCallback((event: DateTimePickerEvent, date?: Date): void => {
    if (Platform.OS === 'android') setShowSimulatedDatePicker(false);
    if (event.type === 'dismissed') { setShowSimulatedDatePicker(false); return; }
    if (event.type === 'set' && date) {
      const dateStr = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
      simulatedDateMutation.mutate(
        { date: dateStr },
        { onSettled: () => setShowSimulatedDatePicker(false) },
      );
    }
  }, [simulatedDateMutation]);

  const handleClearSimulatedDate = useCallback((): void => {
    simulatedDateMutation.mutate({ date: null });
  }, [simulatedDateMutation]);

  const handleTriggerReminder = useCallback((): void => {
    setLastTriggerResult(null);
    triggerReminderMutation.mutate(undefined, {
      onSuccess: (result) => setLastTriggerResult(result),
      onError:   () => setLastTriggerResult(null),
    });
  }, [triggerReminderMutation]);

  // ── Navigation ──────────────────────────────────────────────────────────

  const handleGoToOrders = useCallback((): void => {
    navigation.navigate('Orders');
  }, [navigation]);

  const handleGoToMoiVerified = useCallback((): void => {
    navigation.navigate('MoiVerified');
  }, [navigation]);

  const handleGoToPrivacyPolicy = useCallback((): void => {
    navigation.navigate('PrivacyPolicy');
  }, [navigation]);

  const handleGoToTerms = useCallback((): void => {
    navigation.navigate('TermsAndConditions');
  }, [navigation]);

  const handleGoToPdpa = useCallback((): void => {
    navigation.navigate('PdpaNotice');
  }, [navigation]);

  const handleGoToForgotPassword = useCallback((): void => {
    if (displayEmail) {
      navigation.navigate('ForgotPassword', { prefillEmail: displayEmail });
    } else {
      navigation.navigate('ForgotPassword');
    }
  }, [navigation, displayEmail]);

  const handleUpdatePhone = useCallback((): void => {
    navigation.navigate('UpdatePhone');
  }, [navigation]);

  const handleUpdateEmail = useCallback((): void => {
    navigation.navigate('UpdateEmail');
  }, [navigation]);

  const handleSetLocale = useCallback((l: Locale): void => {
    setLocale(l);
  }, [setLocale]);

  const handleLogout = useCallback((): void => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          // Unregister push token before clearing auth so the API call still has a valid token.
          if (pushToken !== null) {
            unregisterDeviceToken(pushToken).catch(() => {});
          }
          resetUnread();
          queryClient.clear();
          clearAuth(); // isLoggedIn → false → effect navigates to Home
        },
      },
    ]);
  }, [clearAuth, pushToken, queryClient]);

  const handleCheckVersion = useCallback((): void => {
    navigation.navigate('AppVersion');
  }, [navigation]);

  const handleDeleteAccount = useCallback((): void => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all personal data. Your order history will be anonymised. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: () => {
            deleteAccountMutation.mutate(undefined, {
              onSuccess: () => clearAuth(),
            });
          },
        },
      ],
    );
  }, [clearAuth, deleteAccountMutation]);

  const realThaiDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

  return {
    user,
    isLoading,
    isRefreshing,
    realThaiDate,
    simulatedDate:              user?.simulated_date ?? null,
    isUpdatingSimulatedDate:    simulatedDateMutation.isPending,
    showSimulatedDatePicker,
    handleSimulatedDateFieldPress,
    handleSimulatedDatePickerChange,
    handleClearSimulatedDate,
    isTriggeringReminder:  triggerReminderMutation.isPending,
    lastTriggerResult,
    handleTriggerReminder,
    name:          profileForm.name,
    dateOfBirth:   profileForm.dateOfBirth,
    profileErrors: profileForm.errors,
    isDirty:        profileForm.isDirty,
    isSavingProfile: updateMutation.isPending,
    showDatePicker,
    isEditingProfile,
    displayEmail,
    displayPhone,
    needsEmailCompletion,
    isPlaceholderEmail,
    hasPassword,
    currentPassword:        changePasswordForm.currentPassword,
    newPassword:            changePasswordForm.newPassword,
    confirmPassword:        changePasswordForm.confirmPassword,
    passwordErrors:         changePasswordForm.errors,
    isPasswordSectionOpen,
    isChangingPassword:     changePasswordMutation.isPending,
    handleToggleEditProfile,
    handleNameChange:    profileForm.handleNameChange,
    handleDateFieldPress,
    handleDatePickerChange,
    handleSaveProfile,
    handleRefresh,
    handleTogglePasswordSection,
    handleCurrentPasswordChange: changePasswordForm.handleCurrentPasswordChange,
    handleNewPasswordChange:     changePasswordForm.handleNewPasswordChange,
    handleConfirmPasswordChange: changePasswordForm.handleConfirmPasswordChange,
    handleChangePassword,
    locale,
    handleSetLocale,
    handleGoToOrders,
    handleGoToMoiVerified,
    handleGoToPrivacyPolicy,
    handleGoToTerms,
    handleGoToPdpa,
    handleGoToForgotPassword,
    handleLogout,
    handleDeleteAccount,
    isDeletingAccount:   deleteAccountMutation.isPending,
    handleUpdatePhone,
    handleUpdateEmail,
    isUploadingPicture: pictureMethods.isUploadingPicture,
    isRemovingPicture:  pictureMethods.isRemovingPicture,
    handleAvatarPress:  pictureMethods.handleAvatarPress,
    handleCheckVersion,
  };
}
