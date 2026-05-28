import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
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

  const { width } = useWindowDimensions();
  const isMobileWeb = Platform.OS === 'web' && width < 768;

  const formContent = (
    <>
      {error !== null && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={16} color={colours.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder="you@email.com"
          placeholderTextColor={colours.textSubtle}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>PASSWORD</Text>
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
        style={({ pressed }) => [styles.primaryBtn, (isLoading || pressed) && styles.primaryBtnDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityLabel="Sign in"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.backgroundDark} />
          : <Text style={styles.primaryBtnText}>Sign In</Text>}
      </Pressable>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.orLine} />
      </View>

      <Pressable
        style={styles.secondaryBtn}
        onPress={handleGoToOtp}
        accessibilityLabel="Use phone OTP instead"
        accessibilityRole="button"
      >
        <Ionicons name="phone-portrait-outline" size={16} color={colours.primary} />
        <Text style={styles.secondaryBtnText}>Continue with Phone OTP</Text>
      </Pressable>

      <Pressable onPress={handleGoToRegister} accessibilityLabel="Register as merchant" accessibilityRole="button">
        <Text style={styles.footerLink}>
          New merchant? <Text style={styles.footerLinkBold}>Create an account →</Text>
        </Text>
      </Pressable>
    </>
  );

  // ── Web layout ──
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.screen, isMobileWeb && styles.screenColumn]}>
        {isMobileWeb ? (
          <View style={styles.leftPanelMobile}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
            <View>
              <Text style={styles.brandName}>moi·order</Text>
              <Text style={styles.brandRole}>Merchant Platform</Text>
            </View>
          </View>
        ) : (
          <View style={styles.leftPanel}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
            <Text style={styles.brandName}>moi·order</Text>
            <Text style={styles.brandRole}>Merchant Platform</Text>
            <View style={styles.brandDivider} />
            <Text style={styles.brandTagline}>Manage orders, menus, and analytics — all in one place.</Text>
          </View>
        )}
        <View style={[styles.rightPanel, isMobileWeb && styles.rightPanelFull]}>
          <ScrollView
            style={styles.webScroll}
            contentContainerStyle={[styles.webForm, isMobileWeb && styles.webFormMobile]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to your merchant account</Text>
            {formContent}
          </ScrollView>
        </View>
      </View>
    );
  }

  // ── Mobile layout: dark brand panel top + white form sheet bottom ──
  return (
    <KeyboardAvoidingView style={styles.safe} behavior="padding">
      <SafeAreaView style={styles.brandArea} edges={['top']}>
        <View style={styles.brandAreaContent}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
          <View>
            <Text style={styles.brandName}>moi·order</Text>
            <Text style={styles.brandRole}>Merchant Platform</Text>
          </View>
        </View>
        <Text style={styles.brandTagline}>
          Manage orders, menus, and analytics — all in one place.
        </Text>
      </SafeAreaView>
      <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.sheetTitle}>Welcome back</Text>
        <Text style={styles.sheetSubtitle}>Sign in to your merchant account</Text>
        {formContent}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
