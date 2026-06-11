import React, { useCallback } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './WebSidebar.styles';
import { colours } from '../../theme/colours';
import { NotificationBell } from '../../../features/notifications/components/NotificationBell';
import type { WebScreen } from '../../../types/navigation';

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  screen: WebScreen;
  section: 'MAIN' | 'MANAGE' | 'INSIGHTS';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',     icon: 'grid-outline',          activeIcon: 'grid',              screen: 'Dashboard',     section: 'MAIN' },
  { label: 'Orders',        icon: 'receipt-outline',        activeIcon: 'receipt',           screen: 'Orders',        section: 'MAIN' },
  { label: 'Notifications', icon: 'notifications-outline',  activeIcon: 'notifications',     screen: 'Notifications', section: 'MAIN' },
  { label: 'Menu',             icon: 'restaurant-outline',    activeIcon: 'restaurant',          screen: 'Menu',            section: 'MANAGE' },
  { label: 'Restaurant',       icon: 'storefront-outline',    activeIcon: 'storefront',          screen: 'Restaurant',      section: 'MANAGE' },
  { label: 'Business Profile', icon: 'briefcase-outline',     activeIcon: 'briefcase',           screen: 'BusinessProfile', section: 'MANAGE' },
  { label: 'Analytics',     icon: 'bar-chart-outline',      activeIcon: 'bar-chart',         screen: 'Analytics',     section: 'INSIGHTS' },
  { label: 'Reviews',       icon: 'star-outline',            activeIcon: 'star',              screen: 'Reviews',       section: 'INSIGHTS' },
];

interface WebSidebarProps {
  activeScreen: WebScreen;
  onNavigate: (screen: WebScreen) => void;
  onLogout: () => void;
  pendingCount?: number;
}

export function WebSidebar({ activeScreen, onNavigate, onLogout, pendingCount = 0 }: WebSidebarProps): React.JSX.Element {
  const handleNavPress = useCallback(
    (screen: WebScreen) => () => onNavigate(screen),
    [onNavigate],
  );

  const sections: Array<'MAIN' | 'MANAGE' | 'INSIGHTS'> = ['MAIN', 'MANAGE', 'INSIGHTS'];

  return (
    <View style={styles.sidebar}>
      {/* Logo + notification bell row */}
      <View style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <Image
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('../../../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="cover"
            accessibilityLabel="Moi Order logo"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.logoText}>Moi Order</Text>
          <Text style={styles.logoSubText}>Merchant Portal</Text>
        </View>
        {/* Bell in the sidebar header — navigates to Notifications screen */}
        <NotificationBell
          onPress={handleNavPress('Notifications')}
          iconColour="rgba(255,255,255,0.55)"
        />
      </View>

      <View style={styles.navItems}>
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((item) => item.section === section);
          return (
            <View key={section}>
              <Text style={styles.sectionHeader}>{section}</Text>
              {items.map((item) => {
                const isActive = activeScreen === item.screen;
                const badge = item.screen === 'Dashboard' && pendingCount > 0 ? pendingCount : 0;
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
                    <Ionicons
                      name={isActive ? item.activeIcon : item.icon}
                      size={16}
                      color={isActive ? colours.primary : 'rgba(255,255,255,0.45)'}
                    />
                    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                      {item.label}
                    </Text>
                    {badge > 0 && (
                      <View style={styles.navBadge}>
                        <Text style={styles.navBadgeText}>{badge}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </View>

      <View style={styles.bottomSection}>
        <Pressable
          style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
          onPress={onLogout}
          accessibilityLabel="Log out"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={16} color="rgba(255,255,255,0.4)" />
          <Text style={styles.logoutLabel}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
