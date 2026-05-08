import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, LayoutChangeEvent, Platform, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
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

// Non-tab screens that sit above Home in the root stack but keep Home tab highlighted.
const HOME_CHILD_ROUTES: (keyof RootStackParamList)[] = ['NinetyDayReport', 'OtherServices', 'EmbassyServices', 'CompanyServices', 'Places'];

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  route: keyof TabParamList;
  icon: IoniconsName;
  label: string;
  disabled?: boolean;
}

const TAB_LABELS: Record<string, { en: string; mm: string }> = {
  Home:    { en: 'Home',    mm: 'ပင်မ'       },
  Map:     { en: 'Map',     mm: 'မြေပုံ'     },
  Orders:  { en: 'Orders',  mm: 'အော်ဒါများ' },
  Profile: { en: 'Profile', mm: 'ပရိုဖိုင်'  },
};

const TABS: TabItem[] = [
  { route: 'Home',    icon: 'home',     label: 'Home'    },
  { route: 'Map',     icon: 'map',      label: 'Map'     },
  { route: 'Orders',  icon: 'list',     label: 'Orders'  },
  { route: 'Profile', icon: 'person',   label: 'Profile' },
];

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
      {/* Animated pill slides between tabs with liquid stretch spring */}
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
        <View style={[styles.blurWrap, styles.androidWrap]}>
          {tabsRow}
        </View>
      ) : (
        <BlurView intensity={88} tint="systemMaterialLight" style={styles.blurWrap}>
          {tabsRow}
        </BlurView>
      )}
    </View>
  );
}

/**
 * Tab bar adapter — passed as the `tabBar` prop to createBottomTabNavigator.
 * Renders once and never remounts; switching is an instant visibility toggle.
 * Uses state.index from tab navigator for exact active-tab tracking (no useRoute lag).
 */
export function FloatingTabBar({ state, navigation, insets }: BottomTabBarProps): React.JSX.Element {
  const isLoggedIn        = useAuthStore((s) => s.isLoggedIn);
  const isFullscreen      = useMapStore((s) => s.isFullscreen);
  const isBottomSheetOpen = useMapStore((s) => s.isBottomSheetOpen);
  const setFullscreen     = useMapStore((s) => s.setFullscreen);
  const setBottomSheetOpen = useMapStore((s) => s.setBottomSheetOpen);
  const { locale }        = useLocale();
  const slideAnim         = useRef(new Animated.Value(0)).current;

  const activeRoute = (state.routes[state.index]?.name ?? 'Home') as keyof TabParamList;
  const bottom = TAB_BAR_BOTTOM_OFFSET + insets.bottom;
  // Only hide on the Map tab — ignore lingering store state on all other tabs.
  const shouldHide = activeRoute === 'Map' && (isFullscreen || isBottomSheetOpen);

  // Reset map overlay state when leaving the Map tab so the bar is never
  // permanently hidden after the user switches away without closing the sheet.
  useEffect(() => {
    if (activeRoute !== 'Map') {
      setFullscreen(false);
      setBottomSheetOpen(false);
    }
  }, [activeRoute, setFullscreen, setBottomSheetOpen]);

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
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('Login');
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

/**
 * Standalone variant for non-tab screens (NinetyDayReport, OtherServices, Tickets, Legal).
 * Navigates via the root stack to MainTabs and switches to the target tab.
 * Keeps Home tab highlighted when inside HOME_CHILD_ROUTES.
 */
export function StandaloneFloatingTabBar(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { locale } = useLocale();

  const currentRoute = route.name as keyof RootStackParamList;
  // Synchronous ref prevents double-tap visual flicker while root-stack navigate processes.
  const pendingRoute = useRef<string>(currentRoute);

  const effectiveActive: string = HOME_CHILD_ROUTES.includes(currentRoute) ? 'Home' : currentRoute;
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.route === effectiveActive));
  const bottom = TAB_BAR_BOTTOM_OFFSET + insets.bottom;

  function handlePress(tab: TabItem): void {
    if (tab.disabled) return;
    if (tab.route === pendingRoute.current) return;
    pendingRoute.current = tab.route;
    if (tab.route === 'Profile' && !isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    // Navigate root stack to MainTabs and specify which tab to show.
    navigation.navigate('MainTabs', { screen: tab.route });
  }

  return (
    <TabBarView
      activeRoute={effectiveActive}
      activeIndex={activeIndex}
      onTabPress={handlePress}
      bottom={bottom}
      locale={locale}
    />
  );
}
