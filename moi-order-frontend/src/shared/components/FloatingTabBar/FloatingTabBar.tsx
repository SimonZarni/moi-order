import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { useAuthStore } from '@/shared/store/authStore';
import { useMapStore } from '@/shared/store/mapStore';
import { useLocale } from '@/shared/hooks/useLocale';
import { Locale } from '@/shared/store/localeStore';
import { RootStackParamList, TabParamList } from '@/types/navigation';
import { useFloatingTabBarPill } from './useFloatingTabBarPill';
import { styles, TAB_BAR_BOTTOM_OFFSET } from './FloatingTabBar.styles';

// Non-tab screens that keep the Home tab highlighted.
const HOME_CHILD_ROUTES: (keyof RootStackParamList)[] = [
  'NinetyDayReport', 'OtherServices', 'EmbassyServices', 'CompanyServices', 'Places',
];

// All routes where the tab bar is visible.
const TAB_BAR_ROUTES = new Set<string>([
  'Home', 'Map', 'Orders', 'Profile',
  'NinetyDayReport', 'OtherServices', 'EmbassyServices', 'CompanyServices',
  'Places', 'Tickets', 'EmergencyContactList',
  'PrivacyPolicy', 'TermsAndConditions', 'PdpaNotice',
]);

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  route: keyof TabParamList;
  icon: IoniconsName;
  label: string;
  disabled?: boolean;
}

import { getStrings } from '@/shared/i18n';

// TAB_LABELS kept for the 'en'|'mm' accessor pattern at lines below.
// Thai is handled via getStrings fallthrough.
const TAB_LABELS: Record<string, { en: string; mm: string; th: string }> = {
  Home:    { en: 'Home',    mm: 'ပင်မ',        th: 'หน้าหลัก'    },
  Map:     { en: 'Map',     mm: 'မြေပုံ',      th: 'แผนที่'      },
  Orders:  { en: 'Orders',  mm: 'အော်ဒါများ',  th: 'คำสั่งซื้อ'  },
  Profile: { en: 'Profile', mm: 'ပရိုဖိုင်',   th: 'โปรไฟล์'    },
};

const TABS: TabItem[] = [
  { route: 'Home',    icon: 'home',   label: 'Home'    },
  { route: 'Map',     icon: 'map',    label: 'Map'     },
  { route: 'Orders',  icon: 'list',   label: 'Orders'  },
  { route: 'Profile', icon: 'person', label: 'Profile' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared tab bar view (used by both FloatingTabBar and RootFloatingTabBar)
// ─────────────────────────────────────────────────────────────────────────────

interface TabBarViewProps {
  activeRoute: string;
  activeIndex: number;
  onTabPress: (tab: TabItem) => void;
  bottom: number;
  locale: Locale;
}

function TabBarView({ activeRoute, activeIndex, onTabPress, bottom, locale }: TabBarViewProps): React.JSX.Element {
  const onTabChange = useCallback(
    (index: number) => {
      const tab = TABS[index];
      if (tab) onTabPress(tab);
    },
    [onTabPress],
  );

  const { pillLeft, pillWidth, onContainerLayout, panHandlers } = useFloatingTabBarPill(
    activeIndex,
    onTabChange,
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => onContainerLayout(e.nativeEvent.layout.width),
    [onContainerLayout],
  );

  const tabsRow = (
    <View style={styles.tabsRow} onLayout={handleLayout} {...panHandlers}>
      <Animated.View
        style={[styles.pill, { left: pillLeft, width: pillWidth }]}
        pointerEvents="none"
      />
      {TABS.map((tab) => {
        const isActive = tab.route === activeRoute;
        return (
          <Pressable
            key={tab.route}
            style={[styles.tab, tab.disabled && styles.tabDisabled]}
            onPress={() => onTabPress(tab)}
            accessibilityLabel={TAB_LABELS[tab.route]?.[locale] ?? tab.label}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={isActive ? colours.primary : colours.textMuted}
              style={{ opacity: isActive ? 1 : 0.45 }}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {TAB_LABELS[tab.route]?.[locale] ?? tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { bottom }]}>
      {Platform.OS === 'android' ? (
        <View style={[styles.blurWrap, styles.androidWrap]}>{tabsRow}</View>
      ) : (
        <BlurView intensity={88} tint="systemMaterialLight" style={styles.blurWrap}>
          {tabsRow}
        </BlurView>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RootFloatingTabBar — rendered outside NavigationContainer in App.tsx so it
// sits in a separate hardware compositor layer above the Mapbox SurfaceView.
// MapboxGL.MapView stays always mounted; no unmount/remount cycling.
// ─────────────────────────────────────────────────────────────────────────────

type NavRef = NavigationContainerRefWithCurrent<RootStackParamList>;

export function RootFloatingTabBar({ navigationRef }: { navigationRef: NavRef }): React.JSX.Element {
  const isLoggedIn         = useAuthStore(s => s.isLoggedIn);
  const isFullscreen       = useMapStore(s => s.isFullscreen);
  const isBottomSheetOpen  = useMapStore(s => s.isBottomSheetOpen);
  const setFullscreen      = useMapStore(s => s.setFullscreen);
  const setBottomSheetOpen = useMapStore(s => s.setBottomSheetOpen);
  const { locale }         = useLocale();
  const insets             = useSafeAreaInsets();
  const slideAnim          = useRef(new Animated.Value(0)).current;

  const [activeRouteName, setActiveRouteName] = useState<string>('Home');
  const [isVisible, setIsVisible]             = useState<boolean>(true);

  useEffect(() => {
    const update = (): void => {
      const route = navigationRef.getCurrentRoute();
      if (route?.name) {
        setActiveRouteName(route.name);
        setIsVisible(TAB_BAR_ROUTES.has(route.name));
      }
    };
    const unsubscribe = navigationRef.addListener('state', update);
    return unsubscribe;
  }, [navigationRef]);

  const effectiveRoute = (HOME_CHILD_ROUTES as string[]).includes(activeRouteName)
    ? 'Home'
    : activeRouteName;
  const activeIndex = Math.max(0, TABS.findIndex(t => t.route === effectiveRoute));
  const bottom      = TAB_BAR_BOTTOM_OFFSET + insets.bottom;
  const shouldHide  = !isVisible || (activeRouteName === 'Map' && (isFullscreen || isBottomSheetOpen));

  // Reset map overlay state when leaving the Map tab.
  useEffect(() => {
    if (activeRouteName !== 'Map') {
      setFullscreen(false);
      setBottomSheetOpen(false);
    }
  }, [activeRouteName, setFullscreen, setBottomSheetOpen]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: shouldHide ? 150 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [shouldHide, slideAnim]);

  const handlePress = useCallback((tab: TabItem): void => {
    if (!navigationRef.isReady()) return;
    if (tab.disabled) return;
    const onTabScreen = ['Home', 'Map', 'Orders', 'Profile'].includes(activeRouteName);
    if (onTabScreen && tab.route === activeRouteName) return;
    if (tab.route === 'Profile' && !isLoggedIn) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigationRef.navigate('Login' as any);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigationRef.navigate('MainTabs' as any, { screen: tab.route });
  }, [activeRouteName, isLoggedIn, navigationRef]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFillObject, { transform: [{ translateY: slideAnim }] }]}
    >
      <TabBarView
        activeRoute={effectiveRoute}
        activeIndex={activeIndex}
        onTabPress={handlePress}
        bottom={bottom}
        locale={locale}
      />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FloatingTabBar — legacy tabBar prop variant (kept for API compatibility,
// not used now that RootFloatingTabBar handles all screens).
// ─────────────────────────────────────────────────────────────────────────────

export function FloatingTabBar({ state, navigation, insets }: BottomTabBarProps): React.JSX.Element {
  const isLoggedIn        = useAuthStore((s) => s.isLoggedIn);
  const isFullscreen      = useMapStore((s) => s.isFullscreen);
  const isBottomSheetOpen = useMapStore((s) => s.isBottomSheetOpen);
  const { locale }        = useLocale();
  const slideAnim         = useRef(new Animated.Value(0)).current;

  const activeRoute = (state.routes[state.index]?.name ?? 'Home') as keyof TabParamList;
  const bottom      = TAB_BAR_BOTTOM_OFFSET + insets.bottom;
  const shouldHide  = activeRoute === 'Map' && (isFullscreen || isBottomSheetOpen);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: shouldHide ? 150 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [shouldHide, slideAnim]);

  function handlePress(tab: TabItem): void {
    if (tab.disabled) return;
    if (tab.route === activeRoute) return;
    if (tab.route === 'Profile' && !isLoggedIn) {
      navigation.getParent()?.navigate('Login' as never);
      return;
    }
    navigation.navigate(tab.route);
  }

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
      <TabBarView
        activeRoute={activeRoute}
        activeIndex={state.index}
        onTabPress={handlePress}
        bottom={bottom}
        locale={locale}
      />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StandaloneFloatingTabBar — retired. RootFloatingTabBar handles all screens.
// Kept as a no-op export so existing imports compile without changes.
// ─────────────────────────────────────────────────────────────────────────────

export function StandaloneFloatingTabBar(): null {
  return null;
}
