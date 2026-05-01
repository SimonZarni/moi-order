import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {step === 'phone' ? 'Enter your phone number' : 'Enter your OTP'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? 'We will send you a one-time PIN'
            : `OTP sent to ${phoneNumber}`}
        </Text>

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
      </View>
    </SafeAreaView>
  );
}
