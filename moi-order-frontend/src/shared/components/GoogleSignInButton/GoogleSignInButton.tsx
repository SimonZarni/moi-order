import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { styles } from './GoogleSignInButton.styles';

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function GoogleSignInButton({
  onPress,
  isLoading,
  disabled = false,
}: GoogleSignInButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={[styles.button, (isLoading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isLoading || disabled}
      accessibilityLabel="Continue with Google"
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#4285F4" />
      ) : (
        <View style={styles.inner}>
          <Text style={styles.gLogo}>G</Text>
          <Text style={styles.label}>Continue with Google</Text>
        </View>
      )}
    </Pressable>
  );
}
