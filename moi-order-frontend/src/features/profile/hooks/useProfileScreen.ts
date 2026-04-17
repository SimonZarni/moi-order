import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useProfileData } from '@/features/profile/hooks/useProfileData';
import { useProfileForm } from '@/features/profile/hooks/useProfileForm';
import { useChangePasswordForm } from '@/features/profile/hooks/useChangePasswordForm';
import { useAuthStore } from '@/shared/store/authStore';
import { useLocale } from '@/shared/hooks/useLocale';
import { Locale } from '@/shared/store/localeStore';
import { RootStackParamList } from '@/types/navigation';
import { User } from '@/types/models';

export interface UseProfileScreenResult {
  // Data
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  // Profile form
  name: string;
  dateOfBirth: Date | null;
  profileErrors: ReturnType<typeof useProfileForm>['errors'];
  isDirty: boolean;
  isSavingProfile: boolean;
  showDatePicker: boolean;
  isEditingProfile: boolean;
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
  handleGoToPrivacyPolicy: () => void;
  handleGoToTerms: () => void;
  handleGoToPdpa: () => void;
  handleLogout: () => void;
}

export function useProfileScreen(): UseProfileScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const clearAuth  = useAuthStore((s) => s.clearAuth);
  const { locale, setLocale } = useLocale();

  const { user, isLoading, isRefreshing, refetch, updateMutation, changePasswordMutation } = useProfileData();
  const profileForm       = useProfileForm(user);
  const changePasswordForm = useChangePasswordForm();

  const [showDatePicker, setShowDatePicker]         = useState(false);
  const [isPasswordSectionOpen, setPasswordSection] = useState(false);
  const [isEditingProfile, setIsEditingProfile]     = useState(false);

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
      { name: profileForm.name.trim(), dateOfBirth: dobStr },
      {
        onSuccess: () => setIsEditingProfile(false),
        onError:   (err) => profileForm.applyApiError(err),
      },
    );
  }, [profileForm, updateMutation]);

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

  // ── Navigation ──────────────────────────────────────────────────────────

  const handleGoToOrders = useCallback((): void => {
    navigation.navigate('Orders');
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
          clearAuth(); // isLoggedIn → false → effect navigates to Home
        },
      },
    ]);
  }, [clearAuth, navigation]);

  return {
    user,
    isLoading,
    isRefreshing,
    name:            profileForm.name,
    dateOfBirth:     profileForm.dateOfBirth,
    profileErrors:   profileForm.errors,
    isDirty:          profileForm.isDirty,
    isSavingProfile:  updateMutation.isPending,
    showDatePicker,
    isEditingProfile,
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
    handleGoToPrivacyPolicy,
    handleGoToTerms,
    handleGoToPdpa,
    handleLogout,
  };
}
