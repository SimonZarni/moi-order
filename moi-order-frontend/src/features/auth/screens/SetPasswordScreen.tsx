import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSetPasswordScreen } from '@/features/auth/hooks/useSetPasswordScreen';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { styles } from './SetPasswordScreen.styles';

export function SetPasswordScreen(): React.JSX.Element {
  const {
    form, purpose, isSubmitting, bannerError,
    handlePasswordChange, handlePasswordConfirmationChange,
    handleTogglePassword, handleSubmit, handleBack,
  } = useSetPasswordScreen();

  const isReset = purpose === 'password_reset';
  const submitLabel = isSubmitting
    ? (isReset ? 'Resetting…' : 'Creating account…')
    : (isReset ? 'Reset Password' : 'Create Account');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
      <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Moi Order</Text>
            <Text style={styles.heroTitle}>{isReset ? 'New Password' : 'Set Password'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>{isReset ? 'Choose a new password' : 'Create your password'}</Text>
            <Text style={styles.subtitle}>Must be at least 8 characters.</Text>
            <ErrorBanner message={bannerError} />
            <FormField label="Password" value={form.password} onChangeText={handlePasswordChange}
              accessibilityLabel="Password" error={form.errors['password']}
              placeholder="••••••••" secureTextEntry={!form.showPassword}
              autoComplete="new-password" returnKeyType="next"
              rightElement={
                <Pressable style={styles.eyeBtn} onPress={handleTogglePassword}
                  accessibilityLabel={form.showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button">
                  <Text style={styles.eyeText}>{form.showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              } />
            <FormField label="Confirm Password" value={form.passwordConfirmation}
              onChangeText={handlePasswordConfirmationChange}
              accessibilityLabel="Confirm password" error={form.errors['passwordConfirmation']}
              placeholder="••••••••" secureTextEntry={!form.showPassword}
              autoComplete="new-password" returnKeyType="done"
              onSubmitEditing={handleSubmit} />
            <Pressable style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit} disabled={isSubmitting}
              accessibilityLabel={submitLabel} accessibilityRole="button">
              <Text style={styles.submitText}>{submitLabel}</Text>
            </Pressable>
            <View style={styles.backRow}>
              <Pressable onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
                <Text style={styles.backLink}>← Go back</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
