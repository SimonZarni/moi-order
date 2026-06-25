import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, Platform, useWindowDimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRegisterScreen } from '../hooks/useRegisterScreen';
import { styles } from './RegisterScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { OTP_PIN_LENGTH } from '../../../shared/constants/config';
import { useTranslation } from '../../../shared/hooks/useTranslation';

const LOGO = require('../../../../assets/moi-order-icon.png') as number;

export function RegisterScreen(): React.JSX.Element {
  const {
    step, name, email, password, otp,
    isLoading, error, fieldErrors, resendCooldown,
    setName, setEmail, setPassword, setOtp,
    handleSendOtp, handleVerifyAndComplete, handleBack, handleResend,
  } = useRegisterScreen();

  const t = useTranslation();
  const { width } = useWindowDimensions();
  const isMobileWeb = Platform.OS === 'web' && width < 768;

  const credentialsFields = (
    <>
      {error !== null && <Text style={styles.errorBanner}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder={t('register_full_name')}
        placeholderTextColor={colours.textSubtle}
        value={name}
        onChangeText={setName}
        accessibilityLabel="Full name"
      />
      {fieldErrors.name !== undefined && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}
      <TextInput
        style={styles.input}
        placeholder={t('register_email_address')}
        placeholderTextColor={colours.textSubtle}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email address"
      />
      {fieldErrors.email !== undefined && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder={t('register_password')}
        placeholderTextColor={colours.textSubtle}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Password"
      />
      <Text style={styles.inputHint}>{t('register_password_hint')}</Text>
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
          : <Text style={styles.buttonText}>{t('register_send_code')}</Text>}
      </Pressable>
      <Text style={styles.note}>{t('register_note')}</Text>
    </>
  );

  const otpFields = (
    <>
      {error !== null && <Text style={styles.errorBanner}>{error}</Text>}
      <View style={styles.otpInfo}>
        <Ionicons name="checkmark-circle" size={16} color={colours.primary} />
        <Text style={styles.otpInfoText}>
          {t('otp_code_sent_to')}{' '}
          <Text style={{ fontWeight: '700', color: colours.textOnLight }}>{email}</Text>
        </Text>
      </View>
      <TextInput
        style={[styles.input, styles.pinInput]}
        placeholder={'· · · · · ·'.slice(0, OTP_PIN_LENGTH * 2 - 1)}
        placeholderTextColor={colours.textSubtle}
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
          : <Text style={styles.buttonText}>{t('register_verify_create')}</Text>}
      </Pressable>
      <View style={styles.resendRow}>
        <Pressable
          onPress={handleBack}
          accessibilityLabel="Back to edit details"
          accessibilityRole="button"
        >
          <Text style={styles.linkBtn}>{t('register_edit_details')}</Text>
        </Pressable>
        <Pressable
          onPress={handleResend}
          disabled={resendCooldown > 0 || isLoading}
          accessibilityLabel={resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          accessibilityRole="button"
        >
          <Text style={resendCooldown > 0 ? styles.linkBtnMuted : styles.linkBtn}>
            {resendCooldown > 0 ? `${t('register_resend_code')} (${resendCooldown}s)` : t('register_resend_code')}
          </Text>
        </Pressable>
      </View>
    </>
  );

  const isOtp = step === 'otp';
  const formTitle    = isOtp ? t('register_verify_email_title') : t('register_create_account_title');
  const formSubtitle = isOtp ? `${t('otp_code_sent_to')} ${email}` : t('register_create_subtitle');

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
