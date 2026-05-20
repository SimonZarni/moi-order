import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform, ScrollView } from 'react-native';
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

  const formFields = (
    <>
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
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to your merchant account</Text>
            {formFields}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your merchant account</Text>
        {formFields}
      </View>
    </SafeAreaView>
  );
}
