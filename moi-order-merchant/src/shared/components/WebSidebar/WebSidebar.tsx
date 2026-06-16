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

interface DiagnosticInfo {
  wsStatus: string;
  wsError: string | null;
  channelStatus: string;
  channelError: string | null;
  pusherKey: string;
  audioStatus: string;
  audioError: string | null;
}

interface WebSidebarProps {
  activeScreen: WebScreen;
  onNavigate: (screen: WebScreen) => void;
  onLogout: () => void;
  pendingCount?: number;
  isAlarmEnabled?: boolean;
  onAlarmToggle?: () => void;
  onAlarmTest?: () => void;
  diagnostic?: DiagnosticInfo;
}

export function WebSidebar({
  activeScreen,
  onNavigate,
  onLogout,
  pendingCount = 0,
  isAlarmEnabled = true,
  onAlarmToggle,
  onAlarmTest,
  diagnostic,
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              style={({ pressed }) => [styles.navItem, { flex: 1 }, pressed && styles.navItemPressed]}
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
            {isAlarmEnabled && onAlarmTest != null && (
              <Pressable
                onPress={() => onAlarmTest?.()}
                accessibilityLabel="Test alarm sound"
                accessibilityRole="button"
                style={({ pressed }) => ({
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Text style={{ fontSize: 10, color: colours.primary, fontWeight: '700' }}>TEST</Text>
              </Pressable>
            )}
          </View>
        )}
        {diagnostic !== undefined && (
          <View style={diagStyles.panel}>
            <DiagRow label="Pusher key" value={diagnostic.pusherKey ? `…${diagnostic.pusherKey.slice(-6)}` : 'NOT SET'} ok={!!diagnostic.pusherKey} />
            <DiagRow label="WS" value={diagnostic.wsStatus} ok={diagnostic.wsStatus === 'connected'} />
            {diagnostic.wsError !== null && <Text style={diagStyles.err}>{diagnostic.wsError}</Text>}
            <DiagRow label="Channel" value={diagnostic.channelStatus} ok={diagnostic.channelStatus === 'subscribed'} />
            {diagnostic.channelError !== null && <Text style={diagStyles.err}>{diagnostic.channelError}</Text>}
            <DiagRow label="Audio" value={diagnostic.audioStatus} ok={diagnostic.audioStatus === 'running'} />
            {diagnostic.audioError !== null && <Text style={diagStyles.err}>{diagnostic.audioError}</Text>}
          </View>
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

function DiagRow({ label, value, ok }: { label: string; value: string; ok: boolean }): React.JSX.Element {
  return (
    <View style={diagStyles.row}>
      <Text style={[diagStyles.dot, { color: ok ? '#4ade80' : '#f87171' }]}>●</Text>
      <Text style={diagStyles.label}>{label}: </Text>
      <Text style={diagStyles.value}>{value}</Text>
    </View>
  );
}

const diagStyles = {
  panel: { marginHorizontal: 8, marginBottom: 8, padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6 },
  row:   { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 2 },
  dot:   { fontSize: 8, marginRight: 4 },
  label: { fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  value: { fontSize: 10, color: 'rgba(255,255,255,0.85)', flexShrink: 1 },
  err:   { fontSize: 9, color: '#f87171', marginBottom: 2, marginLeft: 16 },
};
