import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.appLabel}>Immigration Services</Text>
            <Text style={styles.appName}>MOI ORDER</Text>
            <Text style={styles.appTagline}>Fast · Reliable · Trusted</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>Welcome back — let's get you in.</Text>

            {bannerError.length > 0 && (
              <View style={styles.banner}>
                <Text style={styles.bannerText}>{bannerError}</Text>
              </View>
            )}

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, form.errors['email'] ? styles.inputWrapperError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.email}
                  onChangeText={handleEmailChange}
                  placeholder="you@example.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  accessibilityLabel="Email address"
                />
              </View>
              {form.errors['email'] ? (
                <Text style={styles.fieldError}>{form.errors['email']}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, form.errors['password'] ? styles.inputWrapperError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.password}
                  onChangeText={handlePasswordChange}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  accessibilityLabel="Password"
                />
                <Pressable
                  style={styles.eyeBtn}
                  onPress={handleTogglePassword}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
              {form.errors['password'] ? (
                <Text style={styles.fieldError}>{form.errors['password']}</Text>
              ) : null}
            </View>

            {/* Submit */}
            <Pressable
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Sign in"
              accessibilityRole="button"
            >
              <Text style={styles.submitText}>{isSubmitting ? 'Signing in…' : 'Sign In'}</Text>
            </Pressable>

            {/* Footer */}
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
