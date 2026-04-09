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
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.appLabel}>Create Your Account</Text>
            <Text style={styles.appName}>MOI ORDER</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardSubtitle}>Join thousands who trust MOI Order.</Text>

            {bannerError.length > 0 && (
              <View style={styles.banner}>
                <Text style={styles.bannerText}>{bannerError}</Text>
              </View>
            )}

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputWrapper, form.errors['name'] ? styles.inputWrapperError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={handleNameChange}
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  accessibilityLabel="Full name"
                />
              </View>
              {form.errors['name'] ? <Text style={styles.fieldError}>{form.errors['name']}</Text> : null}
            </View>

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
              {form.errors['email'] ? <Text style={styles.fieldError}>{form.errors['email']}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, form.errors['password'] ? styles.inputWrapperError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.password}
                  onChangeText={handlePasswordChange}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
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
              {form.errors['password'] ? <Text style={styles.fieldError}>{form.errors['password']}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputWrapper, form.errors['password_confirmation'] ? styles.inputWrapperError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.passwordConfirmation}
                  onChangeText={handlePasswordConfirmationChange}
                  placeholder="Repeat password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  accessibilityLabel="Confirm password"
                />
              </View>
              {form.errors['password_confirmation'] ? (
                <Text style={styles.fieldError}>{form.errors['password_confirmation']}</Text>
              ) : null}
            </View>

            {/* Submit */}
            <Pressable
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Create account"
              accessibilityRole="button"
            >
              <Text style={styles.submitText}>{isSubmitting ? 'Creating account…' : 'Create Account'}</Text>
            </Pressable>

            {/* Footer */}
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
