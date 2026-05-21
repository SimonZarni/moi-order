import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
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

  const formContent = (
    <>
      {error !== null && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={16} color={colours.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {step === 'phone' && (
        <>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
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
            style={({ pressed }) => [styles.primaryBtn, (isLoading || pressed) && styles.primaryBtnDisabled]}
            onPress={handleRequestOtp}
            disabled={isLoading}
            accessibilityLabel="Send OTP"
            accessibilityRole="button"
          >
            {isLoading ? <ActivityIndicator color={colours.white} /> : <Text style={styles.primaryBtnText}>Send OTP Code</Text>}
          </Pressable>
        </>
      )}

      {step === 'pin' && (
        <>
          <View style={styles.otpInfo}>
            <Ionicons name="checkmark-circle" size={16} color={colours.primary} />
            <Text style={styles.otpInfoText}>Code sent to <Text style={{ fontWeight: '700', color: colours.textOnLight }}>{phoneNumber}</Text></Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>ENTER {OTP_PIN_LENGTH}-DIGIT CODE</Text>
            <TextInput
              style={[styles.input, styles.pinInput]}
              placeholder={'· · · · · ·'.slice(0, OTP_PIN_LENGTH * 2 - 1)}
              placeholderTextColor={colours.textSubtle}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={OTP_PIN_LENGTH}
              accessibilityLabel="One-time PIN"
            />
          </View>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, (isLoading || pressed) && styles.primaryBtnDisabled]}
            onPress={handleVerifyOtp}
            disabled={isLoading}
            accessibilityLabel="Verify and sign in"
            accessibilityRole="button"
          >
            {isLoading ? <ActivityIndicator color={colours.white} /> : <Text style={styles.primaryBtnText}>Verify & Sign In</Text>}
          </Pressable>
        </>
      )}
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.screen}>
        <View style={styles.leftPanel}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
          <Text style={styles.brandName}>moi·order</Text>
          <Text style={styles.brandRole}>Merchant Platform</Text>
          <View style={styles.brandDivider} />
          <Text style={styles.brandTagline}>Manage orders, menus, and analytics — all in one place.</Text>
        </View>
        <View style={styles.rightPanel}>
          <ScrollView style={styles.webScroll} contentContainerStyle={styles.webForm} keyboardShouldPersistTaps="handled">
            <Text style={styles.formTitle}>{step === 'phone' ? 'Phone Login' : 'Enter your OTP'}</Text>
            <Text style={styles.formSubtitle}>{step === 'phone' ? 'We will send you a one-time PIN' : `OTP sent to ${phoneNumber}`}</Text>
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
          <View style={[styles.brandIcon, { backgroundColor: step === 'phone' ? colours.primary + '22' : colours.primaryGlow }]}>
            <Ionicons
              name={step === 'phone' ? 'phone-portrait-outline' : 'keypad-outline'}
              size={24}
              color={colours.primary}
            />
          </View>
          <View>
            <Text style={styles.brandName}>moi·order</Text>
            <Text style={styles.brandRole}>Merchant Platform</Text>
          </View>
        </View>
        <Text style={styles.brandTagline}>
          {step === 'phone' ? 'Enter your phone number to receive a login code' : `Enter the code we sent to ${phoneNumber}`}
        </Text>
      </SafeAreaView>
      <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.sheetTitle}>{step === 'phone' ? 'Phone Login' : 'Check your messages'}</Text>
        <Text style={styles.sheetSubtitle}>{step === 'phone' ? "We'll send a one-time PIN to your number" : `A ${OTP_PIN_LENGTH}-digit code was sent to ${phoneNumber}`}</Text>
        {formContent}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
