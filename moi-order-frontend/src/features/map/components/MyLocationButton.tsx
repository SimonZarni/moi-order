import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from './MyLocationButton.styles';

interface Props { onPress: () => void; }

export function MyLocationButton({ onPress }: Props): React.JSX.Element {
  return (
    <Pressable onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      accessibilityRole="button" accessibilityLabel="Go to my location">
      <Text style={styles.icon}>◎</Text>
    </Pressable>
  );
}
