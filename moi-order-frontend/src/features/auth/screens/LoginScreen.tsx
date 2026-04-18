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
import { useLoginScreen } from '@/features/auth/hooks/useLoginScreen';
import { styles } from './LoginScreen.styles';

export function LoginScreen(): React.JSX.Element {
  const {
    form,
    isSubmitting,
    bannerError,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleSubmit,
    handleGoToRegister,
  } = useLoginScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bottomFill} />
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
            <Text style={styles.appLabel}>Immigration Services</Text>
            <Text style={styles.appName}>MOI ORDER</Text>
            <Text style={styles.appTagline}>Fast · Reliable · Trusted</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>Welcome back — let's get you in.</Text>

            <ErrorBanner message={bannerError} />

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
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
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

            <Pressable
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Sign in"
              accessibilityRole="button"
            >
              <Text style={styles.submitText}>{isSubmitting ? 'Signing in…' : 'Sign In'}</Text>
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable
                onPress={handleGoToRegister}
                accessibilityLabel="Create account"
                accessibilityRole="button"
              >
                <Text style={styles.footerLink}>Create Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
