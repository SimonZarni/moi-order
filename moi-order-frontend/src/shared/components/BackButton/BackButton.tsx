import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { styles } from './BackButton.styles';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={styles.btn}
      onPress={onPress}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
    </Pressable>
  );
}
