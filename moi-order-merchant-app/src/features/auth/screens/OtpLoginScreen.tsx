import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const stepTitle = step === 'phone' ? 'Phone Login' : 'Enter your OTP';
  const stepSubtitle = step === 'phone'
    ? 'We will send you a one-time PIN'
    : `OTP sent to ${phoneNumber}`;

  const formFields = (
    <>
      {error !== null && <Text style={styles.errorBanner}>{error}</Text>}
      {step === 'phone' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="+66 8x xxx xxxx"
            placeholderTextColor={colours.medium}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            accessibilityLabel="Phone number"
          />
          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRequestOtp}
            disabled={isLoading}
            accessibilityLabel="Send OTP to phone number"
            accessibilityRole="button"
          >
            {isLoading
              ? <ActivityIndicator color={colours.white} />
              : <Text style={styles.buttonText}>Send OTP</Text>}
          </Pressable>
        </>
      )}
      {step === 'pin' && (
        <>
          <TextInput
            style={styles.input}
            placeholder={`${OTP_PIN_LENGTH}-digit PIN`}
            placeholderTextColor={colours.medium}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={OTP_PIN_LENGTH}
            accessibilityLabel="One-time PIN"
          />
          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyOtp}
            disabled={isLoading}
            accessibilityLabel="Verify OTP and log in"
            accessibilityRole="button"
          >
            {isLoading
              ? <ActivityIndicator color={colours.white} />
              : <Text style={styles.buttonText}>Verify & Login</Text>}
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
          <Text style={styles.brandTagline}>
            Manage orders, menus, and analytics — all in one place.
          </Text>
        </View>
        <View style={styles.rightPanel}>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formCard}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>{stepTitle}</Text>
            <Text style={styles.formSubtitle}>{stepSubtitle}</Text>
            {formFields}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {step === 'phone' ? 'Enter your phone number' : 'Enter your OTP'}
        </Text>
        <Text style={styles.subtitle}>{stepSubtitle}</Text>
        {formFields}
      </View>
    </SafeAreaView>
  );
}
