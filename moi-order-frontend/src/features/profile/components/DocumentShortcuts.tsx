import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { colours } from '@/shared/theme/colours';
import { styles } from './DocumentShortcuts.styles';

interface ShortcutItem {
  label: string;
  sublabel: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
  iconColor: string;
  route: keyof Pick<RootStackParamList, 'PassportVault' | 'NinetyDayVault' | 'MyDocuments'>;
}

const SHORTCUTS: ShortcutItem[] = [
  {
    label:      'Passport',
    sublabel:   'Bio & visa pages',
    icon:       'id-card-outline',
    iconBg:     `${colours.primary}22`,
    iconColor:  colours.primary,
    route:      'PassportVault',
  },
  {
    label:      '90-Day',
    sublabel:   'Report slips',
    icon:       'document-text-outline',
    iconBg:     `${colours.secondary}22`,
    iconColor:  colours.tertiary,
    route:      'NinetyDayVault',
  },
  {
    label:      'My Docs',
    sublabel:   'Permits, IDs & more',
    icon:       'folder-open-outline',
    iconBg:     `${colours.tertiary}22`,
    iconColor:  colours.tertiary,
    route:      'MyDocuments',
  },
];

export function DocumentShortcuts(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.row}>
      {SHORTCUTS.map((item) => (
        <Pressable
          key={item.route}
          style={styles.item}
          onPress={() => navigation.navigate(item.route)}
          accessibilityLabel={item.label}
          accessibilityRole="button"
        >
          <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={22} color={item.iconColor} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.sublabel}>{item.sublabel}</Text>
        </Pressable>
      ))}
    </View>
  );
}
