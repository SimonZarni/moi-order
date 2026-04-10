import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './ErrorBanner.styles';

interface ErrorBannerProps {
  message: string; // renders nothing when empty
}

export function ErrorBanner({ message }: ErrorBannerProps): React.JSX.Element | null {
  if (message.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}
