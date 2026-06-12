import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChangePasswordScreen } from '../hooks/useChangePasswordScreen';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import { styles } from './ChangePasswordScreen.styles';
import { colours } from '../../../shared/theme/colours';

interface ChangePasswordScreenProps {
  onBack: () => void;
}

export function ChangePasswordScreen({ onBack }: ChangePasswordScreenProps): React.JSX.Element {
  const { form, isSaving, successMessage, handleSubmit, handleDismissSuccess } = useChangePasswordScreen();
  const t = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.backBtn} onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to settings">
          <Ionicons name="chevron-back" size={16} color={colours.primary} />
          <Text style={styles.backBtnText}>{t('common_back_to_settings')}</Text>
        </Pressable>

        <Text style={styles.title}>{t('change_password_title')}</Text>

        {successMessage !== null && (
          <Pressable style={styles.successBanner} onPress={handleDismissSuccess} accessibilityRole="button" accessibilityLabel="Dismiss success message">
            <Ionicons name="checkmark-circle" size={18} color={colours.success} />
            <Text style={styles.successText}>{successMessage}</Text>
            <Ionicons name="close" size={16} color={colours.success} />
          </Pressable>
        )}

        <View>
          <Text style={styles.label}>{t('change_password_current')}</Text>
          <TextInput style={[styles.input, form.errors.currentPassword ? styles.inputError : null]}
            value={form.values.currentPassword} onChangeText={form.handleCurrentPasswordChange}
            secureTextEntry placeholder="••••••••" placeholderTextColor={colours.textSubtle}
            autoCapitalize="none" accessibilityLabel="Current password" />
          {form.errors.currentPassword ? <Text style={styles.errorText}>{form.errors.currentPassword}</Text> : null}
        </View>

        <View>
          <Text style={styles.label}>{t('change_password_new')}</Text>
          <TextInput style={[styles.input, form.errors.newPassword ? styles.inputError : null]}
            value={form.values.newPassword} onChangeText={form.handleNewPasswordChange}
            secureTextEntry placeholder="••••••••" placeholderTextColor={colours.textSubtle}
            autoCapitalize="none" accessibilityLabel="New password" />
          {form.errors.newPassword
            ? <Text style={styles.errorText}>{form.errors.newPassword}</Text>
            : <Text style={styles.hint}>{t('change_password_hint')}</Text>}
        </View>

        <View>
          <Text style={styles.label}>{t('change_password_confirm')}</Text>
          <TextInput style={[styles.input, form.errors.confirmPassword ? styles.inputError : null]}
            value={form.values.confirmPassword} onChangeText={form.handleConfirmPasswordChange}
            secureTextEntry placeholder="••••••••" placeholderTextColor={colours.textSubtle}
            autoCapitalize="none" accessibilityLabel="Confirm new password" />
          {form.errors.confirmPassword ? <Text style={styles.errorText}>{form.errors.confirmPassword}</Text> : null}
        </View>

        <Pressable style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSubmit} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save new password">
          <Text style={styles.saveBtnText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
