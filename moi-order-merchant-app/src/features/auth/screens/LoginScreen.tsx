import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginScreen } from '../hooks/useLoginScreen';
import { styles } from './LoginScreen.styles';
import { colours } from '../../../shared/theme/colours';

export function LoginScreen(): React.JSX.Element {
  const {
    email, password, isLoading, error,
    setEmail, setPassword,
    handleSubmit, handleGoToOtp, handleGoToRegister,
  } = useLoginScreen();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your merchant account</Text>

        {error !== null && <Text style={styles.errorBanner}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={colours.medium}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colours.medium}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password"
        />

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          accessibilityLabel="Sign in to your account"
          accessibilityRole="button"
        >
          {isLoading
            ? <ActivityIndicator color={colours.white} />
            : <Text style={styles.buttonText}>Sign In</Text>}
        </Pressable>

        <Pressable onPress={handleGoToOtp} accessibilityLabel="Use phone OTP login instead" accessibilityRole="button">
          <Text style={styles.link}>Use Phone OTP instead</Text>
        </Pressable>
        <Pressable onPress={handleGoToRegister} accessibilityLabel="Create a new merchant account" accessibilityRole="button">
          <Text style={styles.link}>Self-Register as a Merchant</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
