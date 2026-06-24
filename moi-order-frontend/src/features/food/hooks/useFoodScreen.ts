import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartStore } from '@/shared/store/cartStore';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';
import { Restaurant } from '@/types/models';
import { useCustomerLocation, CustomerLocationPermission } from '@/shared/hooks/useCustomerLocation';
import { useRestaurantListData, UseRestaurantListDataResult } from './useRestaurantListData';
import { useFoodOrdersData } from './useFoodOrdersData';

export const FOOD_CATEGORIES = ['All', 'Thai', 'Japanese', 'Burger', 'Coffee', 'Pizza', 'Dessert', 'Seafood', 'Chinese'] as const;
export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export interface UseFoodScreenResult extends UseRestaurantListDataResult {
  cartItemCount:              number;
  activeOrderCount:           number;
  searchText:                 string;
  activeCategory:             FoodCategory;
  locationPermissionStatus:   CustomerLocationPermission;
  locationError:              boolean;
  setSearchText:              (t: string) => void;
  setActiveCategory:          (c: FoodCategory) => void;
  handleRestaurantPress:      (restaurant: Restaurant) => void;
  handleAddressPress:         () => void;
  handleCartPress:            () => void;
  handleOrdersPress:          () => void;
  handleBack:                 () => void;
  requestLocationPermission:  () => Promise<void>;
}

export function useFoodScreen(): UseFoodScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartCount  = useCartStore((s) => s.itemCount());
  const { orders } = useFoodOrdersData();

  const { location, permissionStatus, locationError, requestPermission } = useCustomerLocation();

  const activeOrderCount = useMemo(
    () => orders.filter((o) =>
      o.status !== FOOD_ORDER_STATUS.Completed &&
      o.status !== FOOD_ORDER_STATUS.Cancelled  &&
      o.status !== FOOD_ORDER_STATUS.Expired,
    ).length,
    [orders],
  );

  const [searchText,     setSearchTextState]     = useState<string>('');
  const [activeCategory, setActiveCategoryState] = useState<FoodCategory>('All');

  // Pass effective search string to data hook — empty string means no filter.
  const effectiveSearch = searchText.trim() !== '' ? searchText.trim() : undefined;
  const listData = useRestaurantListData(effectiveSearch, location?.latitude, location?.longitude);

  const setSearchText = useCallback((t: string) => {
    setSearchTextState(t);
    // Clear category pill selection when user manually types.
    setActiveCategoryState('All');
  }, []);

  const setActiveCategory = useCallback((c: FoodCategory) => {
    setActiveCategoryState(c);
    if (c === 'All') {
      setSearchTextState('');
    } else {
      setSearchTextState(c);
    }
  }, []);

  const handleRestaurantPress = useCallback(
    (restaurant: Restaurant) => {
      navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
    },
    [navigation],
  );

  const handleAddressPress = useCallback(() => navigation.navigate('AddressList', { mode: 'manage' }), [navigation]);
  const handleCartPress    = useCallback(() => navigation.navigate('Cart'),                            [navigation]);
  const handleOrdersPress  = useCallback(() => navigation.navigate('FoodOrders'),                     [navigation]);
  const handleBack         = useCallback(() => navigation.goBack(),                                    [navigation]);

  return {
    ...listData,
    cartItemCount:             cartCount,
    activeOrderCount,
    searchText,
    activeCategory,
    locationPermissionStatus:  permissionStatus,
    locationError,
    setSearchText,
    setActiveCategory,
    handleRestaurantPress,
    handleAddressPress,
    handleCartPress,
    handleOrdersPress,
    handleBack,
    requestLocationPermission: requestPermission,
  };
}
