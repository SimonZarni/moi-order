import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './SuccessState.styles';

interface SuccessStateProps {
  title: string;
  subtitle: string;
  buttonLabel: string;
  onButtonPress: () => void;
}

export function SuccessState({
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
}: SuccessStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Pressable
        style={styles.button}
        onPress={onButtonPress}
        accessibilityLabel={buttonLabel}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}
