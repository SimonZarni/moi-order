import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './AuthMethodTabs.styles';

export type AuthMethod = 'email' | 'phone';

interface AuthMethodTabsProps {
  value: AuthMethod;
  onChange: (value: AuthMethod) => void;
}

export function AuthMethodTabs({ value, onChange }: AuthMethodTabsProps): React.JSX.Element {
  return (
    <View style={styles.root}>
      <Pressable
        style={[styles.tab, value === 'email' && styles.tabActive]}
        onPress={() => onChange('email')}
        accessibilityLabel="Email login"
        accessibilityRole="button"
      >
        <Text style={[styles.tabText, value === 'email' && styles.tabTextActive]}>Email</Text>
      </Pressable>
      <Pressable
        style={[styles.tab, value === 'phone' && styles.tabActive]}
        onPress={() => onChange('phone')}
        accessibilityLabel="Phone login"
        accessibilityRole="button"
      >
        <Text style={[styles.tabText, value === 'phone' && styles.tabTextActive]}>Phone</Text>
      </Pressable>
    </View>
  );
}
