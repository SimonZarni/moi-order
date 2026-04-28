import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { styles } from './AppleSignInButton.styles';

interface AppleSignInButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function AppleSignInButton({
  onPress,
  isLoading,
  disabled = false,
}: AppleSignInButtonProps): React.JSX.Element | null {
  if (Platform.OS !== 'ios') return null;

  return (
    <View style={[styles.wrapper, (isLoading || disabled) && styles.wrapperDisabled]}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={14}
        style={styles.button}
        onPress={onPress}
      />
      {(isLoading || disabled) && (
        <View style={styles.overlay} pointerEvents="none">
          {isLoading && <ActivityIndicator size="small" color="#ffffff" />}
        </View>
      )}
    </View>
  );
}
