import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/shared/components/FormField/FormField';
import { useRegisterScreen } from '@/features/auth/hooks/useRegisterScreen';
import { styles } from './RegisterScreen.styles';

export function RegisterScreen(): React.JSX.Element {
  const {
    form,
    isSubmitting,
    bannerError,
    showPassword,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleTogglePassword,
    handleSubmit,
    handleGoToLogin,
  } = useRegisterScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.appLabel}>Create Your Account</Text>
            <Text style={styles.appName}>MOI ORDER</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardSubtitle}>Join thousands who trust MOI Order.</Text>

            <ErrorBanner message={bannerError} />

            <FormField
              label="Full Name"
              value={form.name}
              onChangeText={handleNameChange}
              accessibilityLabel="Full name"
              error={form.errors['name']}
              placeholder="John Doe"
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
            />

            <FormField
              label="Email"
              value={form.email}
              onChangeText={handleEmailChange}
              accessibilityLabel="Email address"
              error={form.errors['email']}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <FormField
              label="Password"
              value={form.password}
              onChangeText={handlePasswordChange}
              accessibilityLabel="Password"
              error={form.errors['password']}
              placeholder="At least 8 characters"
              secureTextEntry={!showPassword}
              returnKeyType="next"
              rightElement={
                <Pressable
                  style={styles.eyeBtn}
                  onPress={handleTogglePassword}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              }
            />

            <FormField
              label="Confirm Password"
              value={form.passwordConfirmation}
              onChangeText={handlePasswordConfirmationChange}
              accessibilityLabel="Confirm password"
              error={form.errors['password_confirmation']}
              placeholder="Repeat password"
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <Pressable
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Create account"
              accessibilityRole="button"
            >
              <Text style={styles.submitText}>{isSubmitting ? 'Creating account…' : 'Create Account'}</Text>
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable
                onPress={handleGoToLogin}
                accessibilityLabel="Sign in"
                accessibilityRole="button"
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
