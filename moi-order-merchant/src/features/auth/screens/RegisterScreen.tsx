import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Platform, useWindowDimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterScreen } from '../hooks/useRegisterScreen';
import { styles } from './RegisterScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { OTP_PIN_LENGTH } from '../../../shared/constants/config';

const LOGO = require('../../../../assets/moi-order-icon.png') as number;

export function RegisterScreen(): React.JSX.Element {
  const {
    step, name, email, password, otp,
    isLoading, error, fieldErrors, resendCooldown,
    setName, setEmail, setPassword, setOtp,
    handleSendOtp, handleVerifyAndComplete, handleBack, handleResend,
  } = useRegisterScreen();

  const { width } = useWindowDimensions();
  const isMobileWeb = Platform.OS === 'web' && width < 768;

  const credentialsFields = (
    <>
      {error !== null && <Text style={styles.errorBanner}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Full name"
      />
      {fieldErrors.name !== undefined && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email address"
      />
      {fieldErrors.email !== undefined && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password"
      />
      <Text style={styles.inputHint}>Min 8 characters · uppercase · lowercase · number</Text>
      {fieldErrors.password !== undefined && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSendOtp}
        disabled={isLoading}
        accessibilityLabel="Send verification code"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.backgroundDark} />
          : <Text style={styles.buttonText}>Send Verification Code</Text>}
      </Pressable>
      <Text style={styles.note}>
        After registration you will complete KYC verification before your store goes live.
      </Text>
    </>
  );

  const otpFields = (
    <>
      {error !== null && <Text style={styles.errorBanner}>{error}</Text>}
      <View style={styles.otpInfo}>
        <Ionicons name="checkmark-circle" size={16} color={colours.primary} />
        <Text style={styles.otpInfoText}>
          Code sent to{' '}
          <Text style={{ fontWeight: '700', color: colours.textOnDark }}>{email}</Text>
        </Text>
      </View>
      <TextInput
        style={[styles.input, styles.pinInput]}
        placeholder={'· · · · · ·'.slice(0, OTP_PIN_LENGTH * 2 - 1)}
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={OTP_PIN_LENGTH}
        accessibilityLabel="One-time verification code"
      />
      {fieldErrors.otp !== undefined && <Text style={styles.fieldError}>{fieldErrors.otp}</Text>}
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleVerifyAndComplete}
        disabled={isLoading}
        accessibilityLabel="Verify and create account"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.backgroundDark} />
          : <Text style={styles.buttonText}>Verify & Create Account</Text>}
      </Pressable>
      <View style={styles.resendRow}>
        <Pressable
          onPress={handleBack}
          accessibilityLabel="Back to edit details"
          accessibilityRole="button"
        >
          <Text style={styles.linkBtn}>← Edit details</Text>
        </Pressable>
        <Pressable
          onPress={handleResend}
          disabled={resendCooldown > 0 || isLoading}
          accessibilityLabel={resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          accessibilityRole="button"
        >
          <Text style={resendCooldown > 0 ? styles.linkBtnMuted : styles.linkBtn}>
            {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend code'}
          </Text>
        </Pressable>
      </View>
    </>
  );

  const isOtp = step === 'otp';
  const formTitle    = isOtp ? 'Verify your email' : 'Create your account';
  const formSubtitle = isOtp ? `Enter the code sent to ${email}` : 'Register to start selling with MOi Order';

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
            <Text style={styles.brandTagline}>
              Manage orders, menus, and analytics — all in one place.
            </Text>
          </View>
        )}
        <View style={[styles.rightPanel, isMobileWeb && styles.rightPanelFull]}>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={[styles.formCard, isMobileWeb && styles.formCardMobile]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>{formTitle}</Text>
            <Text style={styles.formSubtitle}>{formSubtitle}</Text>
            {isOtp ? otpFields : credentialsFields}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{formTitle}</Text>
        <Text style={styles.subtitle}>{formSubtitle}</Text>
        {isOtp ? otpFields : credentialsFields}
      </ScrollView>
    </SafeAreaView>
  );
}
