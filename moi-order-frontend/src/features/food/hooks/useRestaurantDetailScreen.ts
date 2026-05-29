import { useCallback, useMemo, useRef, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { MenuCategory, MenuItem } from '@/types/models';
import { MENU_CATEGORY_TYPE } from '@/types/enums';
import { buildCartKey, useCartStore } from '@/shared/store/cartStore';
import { useStrings } from '@/shared/i18n';
import { useRestaurantDetailData } from './useRestaurantDetailData';

type DetailRoute = RouteProp<RootStackParamList, 'RestaurantDetail'>;

export interface UseRestaurantDetailScreenResult {
  restaurant:       ReturnType<typeof useRestaurantDetailData>['restaurant'];
  sortedCategories: MenuCategory[];
  isLoading:        boolean;
  isError:          boolean;
  activeTabIndex:   number;
  scrollRef:        React.RefObject<ScrollView | null>;
  cartItemCount:    number;
  cartTotalCents:   number;
  getQuantity:      (menuItemId: number) => number;
  isRefreshing:         boolean;
  handleBack:           () => void;
  handleRefresh:        () => void;
  handleTabPress:       (index: number) => void;
  handleTabBarLayout:   (height: number) => void;
  handleSectionLayout:  (index: number, y: number) => void;
  handleScroll:         (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleAddItem:        (item: MenuItem) => void;
  handleRemoveItem:     (cartKey: string) => void;
  handleItemPress:      (item: MenuItem) => void;
  handleCartPress:      () => void;
}

const SYSTEM_SORT: Record<string, number> = {
  [MENU_CATEGORY_TYPE.PopularPicks]:    0,
  [MENU_CATEGORY_TYPE.Promotions]:      1,
  [MENU_CATEGORY_TYPE.Recommendations]: 2,
};

const SYSTEM_CATEGORY_LABEL_KEY: Record<string, 'popularPicks' | 'promotions' | 'recommendations'> = {
  [MENU_CATEGORY_TYPE.PopularPicks]:    'popularPicks',
  [MENU_CATEGORY_TYPE.Promotions]:      'promotions',
  [MENU_CATEGORY_TYPE.Recommendations]: 'recommendations',
};

function sortCategories(categories: MenuCategory[]): MenuCategory[] {
  const system = categories
    .filter((c) => c.is_system)
    .sort((a, b) => (SYSTEM_SORT[a.category_type ?? ''] ?? 99) - (SYSTEM_SORT[b.category_type ?? ''] ?? 99));
  const merchant = categories
    .filter((c) => !c.is_system)
    .sort((a, b) => a.sort_order - b.sort_order);
  return [...system, ...merchant];
}

export function useRestaurantDetailScreen(): UseRestaurantDetailScreenResult {
  const navigation     = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { restaurantId } = useRoute<DetailRoute>().params;
  const s              = useStrings();

  const { restaurant, isLoading, isError, refetch } = useRestaurantDetailData(restaurantId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const addItem   = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const cartCount = useCartStore((s) => s.itemCount());
  const cartTotal = useCartStore((s) => s.totalCents());
  const getQty    = useCartStore((s) => s.getQuantity);

  const scrollRef        = useRef<ScrollView>(null);
  const sectionYsRef     = useRef<Record<number, number>>({});
  const tabBarHeightRef  = useRef(48);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const sortedCategories = useMemo(
    () => sortCategories(restaurant?.menu ?? []),
    [restaurant],
  );

  const displayCategories = useMemo(
    () => sortedCategories.map((c): MenuCategory => {
      if (!c.is_system || !c.category_type) return c;
      const key = SYSTEM_CATEGORY_LABEL_KEY[c.category_type];
      return key ? { ...c, name: s.restaurant[key] } : c;
    }),
    [sortedCategories, s.restaurant],
  );

  const handleTabBarLayout = useCallback((height: number): void => {
    tabBarHeightRef.current = height;
  }, []);

  const handleSectionLayout = useCallback((index: number, y: number): void => {
    sectionYsRef.current[index] = y;
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const y = e.nativeEvent.contentOffset.y;
    const threshold = y + tabBarHeightRef.current + 30;
    let next = 0;
    sortedCategories.forEach((_, i) => {
      if ((sectionYsRef.current[i] ?? 0) <= threshold) next = i;
    });
    setActiveTabIndex((prev) => (prev !== next ? next : prev));
  }, [sortedCategories]);

  const handleTabPress = useCallback((index: number): void => {
    const raw = sectionYsRef.current[index] ?? 0;
    const y   = Math.max(0, raw - tabBarHeightRef.current);
    scrollRef.current?.scrollTo({ y, animated: true });
    setActiveTabIndex(index);
  }, []);

  const handleBack    = useCallback(() => navigation.goBack(), [navigation]);
  const handleCartPress = useCallback(() => navigation.navigate('Checkout'), [navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try { await refetch(); } finally { setIsRefreshing(false); }
  }, [refetch]);

  const handleItemPress = useCallback(
    (item: MenuItem): void => {
      navigation.navigate('MenuItemDetail', { restaurantId, menuItemId: item.id });
    },
    [navigation, restaurantId],
  );

  const handleAddItem = useCallback(
    (item: MenuItem): void => {
      if (!restaurant) return;
      if (item.option_groups.length > 0) {
        navigation.navigate('MenuItemDetail', { restaurantId, menuItemId: item.id });
        return;
      }
      const cartKey = buildCartKey(item.id, []);
      if (getQty(item.id) > 0) {
        increment(cartKey);
      } else {
        addItem(
          { cartKey, menuItemId: item.id, name: item.name, basePriceCents: item.price_cents,
            additionalPriceCents: 0, photoUrl: item.photo_url, selectedOptions: [] },
          restaurant.id,
          restaurant.name,
        );
      }
    },
    [restaurant, restaurantId, navigation, addItem, increment, getQty],
  );

  const handleRemoveItem = useCallback((cartKey: string): void => decrement(cartKey), [decrement]);

  return {
    restaurant,
    sortedCategories: displayCategories,
    isLoading,
    isError,
    activeTabIndex,
    scrollRef,
    cartItemCount:  cartCount,
    cartTotalCents: cartTotal,
    getQuantity:    getQty,
    isRefreshing,
    handleBack,
    handleRefresh,
    handleTabPress,
    handleTabBarLayout,
    handleSectionLayout,
    handleScroll,
    handleAddItem,
    handleRemoveItem,
    handleItemPress,
    handleCartPress,
  };
}
