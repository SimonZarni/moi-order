import React from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  Platform, ScrollView, KeyboardAvoidingView, useWindowDimensions, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLoginScreen } from '../hooks/useLoginScreen';
import { styles } from './LoginScreen.styles';
import { colours } from '../../../shared/theme/colours';

const LOGO = require('../../../../assets/moi-order-icon.png') as number;

export function LoginScreen(): React.JSX.Element {
  const {
    email, password, showPassword, passwordFocused, passwordInputRef, isLoading,
    isGoogleLoading, isAppleLoading, isLineLoading, appleAvailable,
    error,
    setEmail, setPassword, handleTogglePassword, handlePasswordFocus, handlePasswordBlur,
    handleSubmit, handleGoogleSignIn, handleAppleSignIn, handleLineSignIn,
    handleGoToOtp, handleGoToRegister,
  } = useLoginScreen();

  const { width } = useWindowDimensions();
  const isMobileWeb = Platform.OS === 'web' && width < 768;
  const socialDisabled = isLoading || isGoogleLoading || isAppleLoading || isLineLoading;

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
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          accessibilityLabel="Email address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <View style={[styles.inputWrap, passwordFocused && styles.inputWrapFocused]}>
          <TextInput
            ref={passwordInputRef}
            style={styles.inputField}
            placeholder="••••••••"
            placeholderTextColor={colours.textSubtle}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="go"
            onSubmitEditing={() => { void handleSubmit(); }}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            accessibilityLabel="Password"
          />
          <Pressable
            onPress={handleTogglePassword}
            style={styles.eyeBtn}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colours.textSubtle}
            />
          </Pressable>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.primaryBtn, (isLoading || pressed) && styles.primaryBtnDisabled]}
        onPress={handleSubmit}
        disabled={socialDisabled}
        accessibilityLabel="Sign in"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.backgroundDark} />
          : <Text style={styles.primaryBtnText}>Sign In</Text>}
      </Pressable>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or continue with</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.socialRow}>
        <Pressable
          style={[styles.socialBtn, socialDisabled && styles.socialBtnDisabled]}
          onPress={() => handleGoogleSignIn()}
          disabled={socialDisabled}
          accessibilityLabel="Sign in with Google"
          accessibilityRole="button"
        >
          {isGoogleLoading
            ? <ActivityIndicator size="small" color={colours.textOnDark} />
            : <Ionicons name="logo-google" size={20} color={colours.textOnDark} />}
          <Text style={styles.socialBtnText}>Google</Text>
        </Pressable>

        {(Platform.OS === 'ios' ? appleAvailable : Platform.OS === 'web') && (
          <Pressable
            style={[styles.socialBtn, socialDisabled && styles.socialBtnDisabled]}
            onPress={() => handleAppleSignIn()}
            disabled={socialDisabled}
            accessibilityLabel="Sign in with Apple"
            accessibilityRole="button"
          >
            {isAppleLoading
              ? <ActivityIndicator size="small" color={colours.textOnDark} />
              : <Ionicons name="logo-apple" size={20} color={colours.textOnDark} />}
            <Text style={styles.socialBtnText}>Apple</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.socialBtn, socialDisabled && styles.socialBtnDisabled]}
          onPress={() => handleLineSignIn()}
          disabled={socialDisabled}
          accessibilityLabel="Sign in with LINE"
          accessibilityRole="button"
        >
          {isLineLoading
            ? <ActivityIndicator size="small" color={colours.textOnDark} />
            : <Text style={styles.socialBtnLine}>LINE</Text>}
        </Pressable>
      </View>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.orLine} />
      </View>

      <Pressable
        style={[styles.secondaryBtn, socialDisabled && styles.primaryBtnDisabled]}
        onPress={handleGoToOtp}
        disabled={socialDisabled}
        accessibilityLabel="Use phone OTP instead"
        accessibilityRole="button"
      >
        <Ionicons name="phone-portrait-outline" size={16} color={colours.primary} />
        <Text style={styles.secondaryBtnText}>Continue with Phone OTP</Text>
      </Pressable>

      {/* Registration is invite-only — button hidden */}
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.screen, isMobileWeb && styles.screenColumn]}>
        {isMobileWeb ? (
          <View style={styles.leftPanelMobile}>
            <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" accessibilityLabel="MOi Order logo" />
            <View>
              <Text style={styles.brandName}>MOi Order</Text>
              <Text style={styles.brandRole}>Merchant Platform</Text>
            </View>
          </View>
        ) : (
          <View style={styles.leftPanel}>
            <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" accessibilityLabel="MOi Order logo" />
            <Text style={styles.brandName}>MOi Order</Text>
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

  return (
    <KeyboardAvoidingView style={styles.safe} behavior="padding">
      <SafeAreaView style={styles.brandArea} edges={['top']}>
        <View style={styles.brandAreaContent}>
          <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" accessibilityLabel="MOi Order logo" />
          <View>
            <Text style={styles.brandName}>MOi Order</Text>
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
