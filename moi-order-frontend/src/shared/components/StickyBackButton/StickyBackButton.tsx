import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { styles } from './StickyBackButton.styles';

interface StickyBackButtonProps {
  onPress: () => void;
  label: string;
}

export function StickyBackButton({ onPress, label }: StickyBackButtonProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      style={[styles.btn, { top: insets.top + spacing.xs }]}
      onPress={onPress}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Ionicons name="chevron-back" size={20} color={colours.tertiary} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
