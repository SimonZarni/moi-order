import React from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegisterScreen } from '../hooks/useRegisterScreen';
import { styles } from './RegisterScreen.styles';
import { colours } from '../../../shared/theme/colours';

export function RegisterScreen(): React.JSX.Element {
  const {
    name, email, password, isLoading, error, fieldErrors,
    setName, setEmail, setPassword, handleSubmit,
  } = useRegisterScreen();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Register to start selling with Moi Order</Text>

        {error !== null && <Text style={styles.errorBanner}>{error}</Text>}

        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colours.medium}
          value={name} onChangeText={setName} accessibilityLabel="Full name" />
        {fieldErrors.name !== undefined && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}

        <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={colours.medium}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
          accessibilityLabel="Email address" />
        {fieldErrors.email !== undefined && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}

        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colours.medium}
          value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Password" />
        <Text style={styles.inputHint}>Min 8 characters · uppercase · lowercase · number</Text>
        {fieldErrors.password !== undefined && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit} disabled={isLoading}
          accessibilityLabel="Create merchant account" accessibilityRole="button"
        >
          {isLoading
            ? <ActivityIndicator color={colours.white} />
            : <Text style={styles.buttonText}>Create Account</Text>}
        </Pressable>

        <Text style={styles.note}>
          After registration you will complete KYC verification before your store goes live.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
