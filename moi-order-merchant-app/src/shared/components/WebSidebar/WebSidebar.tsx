import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './WebSidebar.styles';
import { colours } from '../../theme/colours';

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Orders', icon: 'receipt-outline', route: 'Orders' },
  { label: 'Menu', icon: 'restaurant-outline', route: 'Menu' },
  { label: 'Profile', icon: 'person-outline', route: 'Profile' },
];

interface WebSidebarProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  onLogout: () => void;
}

export function WebSidebar({
  activeRoute,
  onNavigate,
  onLogout,
}: WebSidebarProps): React.JSX.Element {
  const handleNavPress = useCallback(
    (route: string) => () => {
      onNavigate?.(route);
    },
    [onNavigate],
  );

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Moi Order</Text>
        <Text style={styles.logoSubText}>Merchant</Text>
      </View>

      <View style={styles.navItems}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.route;
          return (
            <Pressable
              key={item.route}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={handleNavPress(item.route)}
              accessibilityLabel={`Navigate to ${item.label}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colours.primary : colours.medium}
                style={styles.navIcon}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={onLogout}
        accessibilityLabel="Log out of merchant account"
        accessibilityRole="button"
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color={colours.medium}
          style={styles.navIcon}
        />
        <Text style={styles.logoutLabel}>Log Out</Text>
      </Pressable>
    </View>
  );
}
