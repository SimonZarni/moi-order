import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOtpLoginScreen } from '../hooks/useOtpLoginScreen';
import { styles } from './OtpLoginScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { OTP_PIN_LENGTH } from '../../../shared/constants/config';

export function OtpLoginScreen(): React.JSX.Element {
  const {
    step, phoneNumber, pin, isLoading, error,
    setPhoneNumber, setPin,
    handleRequestOtp, handleVerifyOtp,
  } = useOtpLoginScreen();

  const stepIcon: keyof typeof Ionicons.glyphMap = step === 'phone' ? 'phone-portrait-outline' : 'keypad-outline';
  const stepTitle = step === 'phone' ? 'Phone Login' : 'Enter your OTP';
  const stepSubtitle = step === 'phone' ? 'We will send you a one-time PIN' : `OTP sent to ${phoneNumber}`;

  const formFields = (
    <>
      {error !== null && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={16} color={colours.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
      {step === 'phone' && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+66 8x xxx xxxx"
              placeholderTextColor={colours.textSubtle}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              accessibilityLabel="Phone number"
            />
          </View>
          <Pressable
            style={({ pressed }) => [styles.button, (isLoading || pressed) && styles.buttonDisabled]}
            onPress={handleRequestOtp}
            disabled={isLoading}
            accessibilityLabel="Send OTP to phone number"
            accessibilityRole="button"
          >
            {isLoading ? <ActivityIndicator color={colours.white} /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </Pressable>
        </>
      )}
      {step === 'pin' && (
        <>
          <View style={styles.otpHint}>
            <Ionicons name="information-circle-outline" size={14} color={colours.primary} />
            <Text style={styles.otpHintText}>Enter the {OTP_PIN_LENGTH}-digit code sent to {phoneNumber}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>One-Time PIN</Text>
            <TextInput
              style={[styles.input, styles.pinInput]}
              placeholder={'_ '.repeat(OTP_PIN_LENGTH).trim()}
              placeholderTextColor={colours.textSubtle}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={OTP_PIN_LENGTH}
              accessibilityLabel="One-time PIN"
            />
          </View>
          <Pressable
            style={({ pressed }) => [styles.button, (isLoading || pressed) && styles.buttonDisabled]}
            onPress={handleVerifyOtp}
            disabled={isLoading}
            accessibilityLabel="Verify OTP and log in"
            accessibilityRole="button"
          >
            {isLoading ? <ActivityIndicator color={colours.white} /> : <Text style={styles.buttonText}>Verify & Sign In</Text>}
          </Pressable>
        </>
      )}
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
          <Text style={styles.brandTagline}>Manage orders, menus, and analytics — all in one place.</Text>
        </View>
        <View style={styles.rightPanel}>
          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formCard} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.formTitle}>{stepTitle}</Text>
            <Text style={styles.formSubtitle}>{stepSubtitle}</Text>
            {formFields}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.brandPanel}>
        <View style={[styles.stepIconWrap, { backgroundColor: colours.primary + '22' }]}>
          <Ionicons name={stepIcon} size={22} color={colours.primary} />
        </View>
        <View>
          <Text style={styles.brandName}>moi·order</Text>
          <Text style={styles.brandRole}>Merchant Platform</Text>
        </View>
      </View>
      <ScrollView style={styles.formSheet} contentContainerStyle={styles.formSheetContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{step === 'phone' ? 'Enter your phone number' : 'Enter your OTP'}</Text>
        <Text style={styles.subtitle}>{stepSubtitle}</Text>
        {formFields}
      </ScrollView>
    </SafeAreaView>
  );
}
