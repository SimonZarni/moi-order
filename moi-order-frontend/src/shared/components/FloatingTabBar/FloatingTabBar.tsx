import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '@/types/navigation';
import { styles } from './FloatingTabBar.styles';

/**
 * Routes that conceptually belong to the Home tab.
 * Explicitly typing this ensures we only include valid keys from our ParamList.
 */
const HOME_CHILD_ROUTES: (keyof RootStackParamList)[] = ['NinetyDayReport', 'OtherServices'];

interface TabItem {
  route: keyof RootStackParamList;
  icon: string;
  label: string;
  disabled?: boolean;
}

const TABS: TabItem[] = [
  { route: 'Home',   icon: '🏠', label: 'Home'    },
  { route: 'Places', icon: '📍', label: 'Places'  },
  { route: 'Orders', icon: '📋', label: 'Orders'  },
  // Ensure 'Profile' exists in your RootStackParamList or add it here
  { route: 'Profile' as keyof RootStackParamList, icon: '👤', label: 'Profile', disabled: true },
];

export function FloatingTabBar(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const currentRoute = route.name as keyof RootStackParamList;
  
  // Logic to keep the 'Home' tab highlighted when inside child screens
  const effectiveActive: keyof RootStackParamList = HOME_CHILD_ROUTES.includes(currentRoute)
    ? 'Home'
    : currentRoute;

  function handlePress(tab: TabItem): void {
    if (tab.disabled) return;
    if (tab.route === effectiveActive) return;

    /**
     * FIX: Use 'as any' here. 
     * TypeScript struggles with the navigate overload because it can't 
     * verify if tab.route requires mandatory parameters at runtime.
     */
    navigation.navigate(tab.route as any);
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
              tab.disabled && styles.tabDisabled,
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