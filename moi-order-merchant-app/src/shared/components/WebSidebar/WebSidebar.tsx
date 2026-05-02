import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './WebSidebar.styles';
import { colours } from '../../theme/colours';
import type { WebScreen } from '../../../types/navigation';

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  screen: WebScreen;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid', screen: 'Dashboard' },
  { label: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt', screen: 'Orders' },
  { label: 'Menu', icon: 'restaurant-outline', activeIcon: 'restaurant', screen: 'Menu' },
  { label: 'Restaurant', icon: 'storefront-outline', activeIcon: 'storefront', screen: 'Restaurant' },
  { label: 'Analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart', screen: 'Analytics' },
];

interface WebSidebarProps {
  activeScreen: WebScreen;
  onNavigate: (screen: WebScreen) => void;
  onLogout: () => void;
}

export function WebSidebar({
  activeScreen,
  onNavigate,
  onLogout,
}: WebSidebarProps): React.JSX.Element {
  const handleNavPress = useCallback(
    (screen: WebScreen) => () => onNavigate(screen),
    [onNavigate],
  );

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>M</Text>
        </View>
        <View>
          <Text style={styles.logoText}>Moi Order</Text>
          <Text style={styles.logoSubText}>Merchant Portal</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.navItems}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.screen;
          return (
            <Pressable
              key={item.screen}
              style={({ pressed }) => [
                styles.navItem,
                isActive && styles.navItemActive,
                pressed && !isActive && styles.navItemPressed,
              ]}
              onPress={handleNavPress(item.screen)}
              accessibilityLabel={`Navigate to ${item.label}`}
              accessibilityRole="button"
            >
              {isActive && <View style={styles.activeIndicator} />}
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={20}
                color={isActive ? colours.primary : colours.textSubtle}
                style={styles.navIcon}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.divider} />
        <Pressable
          style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
          onPress={onLogout}
          accessibilityLabel="Log out of merchant account"
          accessibilityRole="button"
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colours.error}
            style={styles.navIcon}
          />
          <Text style={styles.logoutLabel}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
