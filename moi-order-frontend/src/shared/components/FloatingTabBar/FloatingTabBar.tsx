import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '@/types/navigation';
import { styles } from './FloatingTabBar.styles';

// Routes that belong to the Home tab conceptually (no direct tab match)
const HOME_CHILD_ROUTES: (keyof RootStackParamList)[] = ['NinetyDayReport', 'OtherServices'];

interface TabItem {
  route: keyof RootStackParamList | 'Profile';
  icon: string;
  label: string;
  disabled?: boolean;
}

const TABS: TabItem[] = [
  { route: 'Home',   icon: '🏠', label: 'Home'    },
  { route: 'Places', icon: '📍', label: 'Places'  },
  { route: 'Orders', icon: '📋', label: 'Orders'  },
  { route: 'Profile', icon: '👤', label: 'Profile', disabled: true },
];

export function FloatingTabBar(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const currentRoute = route.name as keyof RootStackParamList;
  const effectiveActive: string = HOME_CHILD_ROUTES.includes(currentRoute)
    ? 'Home'
    : currentRoute;

  function handlePress(tab: TabItem): void {
    if (tab.disabled) return;
    if (tab.route === effectiveActive) return; // already active — no-op
    navigation.navigate(tab.route as keyof RootStackParamList);
  }

  return (
    <View style={[styles.container, { bottom: 14 + insets.bottom }]}>
      {TABS.map((tab) => {
        const isActive = tab.route === effectiveActive;
        return (
          <Pressable
            key={tab.route}
            style={[
              styles.tab,
              isActive && styles.tabActive,
              tab.disabled === true && styles.tabDisabled,
            ]}
            onPress={() => handlePress(tab)}
            accessibilityLabel={tab.label}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
