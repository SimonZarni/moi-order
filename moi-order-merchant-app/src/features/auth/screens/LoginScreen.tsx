import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLoginScreen } from '../hooks/useLoginScreen';
import { styles } from './LoginScreen.styles';
import { colours } from '../../../shared/theme/colours';

export function LoginScreen(): React.JSX.Element {
  const {
    email, password, isLoading, error,
    setEmail, setPassword,
    handleSubmit, handleGoToOtp, handleGoToRegister,
  } = useLoginScreen();

  const formFields = (
    <>
      {error !== null && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={16} color={colours.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor={colours.textSubtle}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colours.textSubtle}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password"
        />
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, (isLoading || pressed) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityLabel="Sign in to your account"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.white} />
          : <Text style={styles.buttonText}>Sign In</Text>}
      </Pressable>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
      <Pressable style={styles.outlineButton} onPress={handleGoToOtp} accessibilityLabel="Use phone OTP login instead" accessibilityRole="button">
        <Ionicons name="phone-portrait-outline" size={16} color={colours.primary} />
        <Text style={styles.outlineButtonText}>Continue with Phone OTP</Text>
      </Pressable>
      <Pressable onPress={handleGoToRegister} accessibilityLabel="Create a new merchant account" accessibilityRole="button">
        <Text style={styles.link}>New merchant? <Text style={styles.linkBold}>Create an account</Text></Text>
      </Pressable>
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.screen}>
        <View style={styles.leftPanel}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>M</Text>
          </View>
          <Text style={styles.brandName}>moi·order</Text>
          <Text style={styles.brandRole}>Merchant Platform</Text>
          <View style={styles.brandDivider} />
          <Text style={styles.brandTagline}>
            Manage orders, menus, and analytics — all in one place.
          </Text>
        </View>
        <View style={styles.rightPanel}>
          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formCard} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to your merchant account</Text>
            {formFields}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Brand mark in dark area */}
      <View style={styles.brandPanel}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>M</Text>
        </View>
        <View>
          <Text style={styles.brandName}>moi·order</Text>
          <Text style={styles.brandRole}>Merchant Platform</Text>
        </View>
      </View>
      {/* Form sheet */}
      <ScrollView style={styles.formSheet} contentContainerStyle={styles.formSheetContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your merchant account</Text>
        {formFields}
      </ScrollView>
    </SafeAreaView>
  );
}
