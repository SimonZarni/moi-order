import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { styles } from './TicketsSearchBar.styles';

interface TicketsSearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
}

export function TicketsSearchBar({ query, onQueryChange }: TicketsSearchBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={16} color={colours.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search tickets…"
          placeholderTextColor={styles.placeholder.color}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search tickets"
          accessibilityRole="search"
        />
        {query.length > 0 && (
          <Pressable
            style={styles.clearBtn}
            onPress={() => onQueryChange('')}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={16} color={colours.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
