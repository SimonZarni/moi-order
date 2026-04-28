import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { styles } from './LineSignInButton.styles';

interface LineSignInButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function LineSignInButton({
  onPress,
  isLoading,
  disabled = false,
}: LineSignInButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={[styles.button, (isLoading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isLoading || disabled}
      accessibilityLabel="Continue with LINE"
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <View style={styles.inner}>
          <Text style={styles.icon}>LINE</Text>
          <Text style={styles.label}>Continue with LINE</Text>
        </View>
      )}
    </Pressable>
  );
}
