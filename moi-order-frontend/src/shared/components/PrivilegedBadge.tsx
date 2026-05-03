import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './PrivilegedBadge.styles';

interface Props {
  size?: 'sm' | 'md';
}

export function PrivilegedBadge({ size = 'md' }: Props): React.JSX.Element {
  const iconSize = size === 'sm' ? 10 : 13;

  return (
    <View style={[styles.badge, size === 'sm' && styles.badgeSm]}>
      <Ionicons name="checkmark" size={iconSize} color="#fff" />
      {size === 'md' && <Text style={styles.label}>Privileged</Text>}
    </View>
  );
}
