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
  section: 'MAIN' | 'MANAGE' | 'INSIGHTS' | 'ACCOUNT';
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
  { label: 'Settings',      icon: 'settings-outline',        activeIcon: 'settings',          screen: 'Settings',      section: 'ACCOUNT' },
];

interface WebSidebarProps {
  activeScreen: WebScreen;
  onNavigate: (screen: WebScreen) => void;
  onLogout: () => void;
  pendingCount?: number;
  isAlarmEnabled?: boolean;
  onAlarmToggle?: () => void;
}

export function WebSidebar({
  activeScreen,
  onNavigate,
  onLogout,
  pendingCount = 0,
  isAlarmEnabled = true,
  onAlarmToggle,
}: WebSidebarProps): React.JSX.Element {
  const handleNavPress = useCallback(
    (screen: WebScreen) => () => onNavigate(screen),
    [onNavigate],
  );

  const sections: Array<'MAIN' | 'MANAGE' | 'INSIGHTS' | 'ACCOUNT'> = ['MAIN', 'MANAGE', 'INSIGHTS', 'ACCOUNT'];

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
            accessibilityLabel="MOi Order logo"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.logoText}>MOi Order</Text>
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
        {onAlarmToggle != null && (
          <Pressable
            style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
            onPress={onAlarmToggle}
            accessibilityLabel={isAlarmEnabled ? 'Disable order alarm' : 'Enable order alarm'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isAlarmEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
              size={16}
              color={isAlarmEnabled ? colours.primary : 'rgba(255,255,255,0.4)'}
            />
            <Text style={[styles.logoutLabel, isAlarmEnabled && styles.alarmLabelActive]}>
              {isAlarmEnabled ? 'Alarm On' : 'Alarm Off'}
            </Text>
          </Pressable>
        )}
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
