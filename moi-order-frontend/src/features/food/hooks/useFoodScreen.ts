import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartStore } from '@/shared/store/cartStore';
import { RootStackParamList } from '@/types/navigation';
import { Restaurant } from '@/types/models';
import { useRestaurantListData, UseRestaurantListDataResult } from './useRestaurantListData';

export const FOOD_CATEGORIES = ['All', 'Thai', 'Japanese', 'Burger', 'Coffee', 'Pizza', 'Dessert', 'Seafood', 'Chinese'] as const;
export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export interface UseFoodScreenResult extends UseRestaurantListDataResult {
  cartItemCount:         number;
  searchText:            string;
  activeCategory:        FoodCategory;
  setSearchText:         (t: string) => void;
  setActiveCategory:     (c: FoodCategory) => void;
  handleRestaurantPress: (restaurant: Restaurant) => void;
  handleMapPress:        () => void;
  handleAddressPress:    () => void;
  handleOrdersPress:     () => void;
  handleCartPress:       () => void;
  handleBack:            () => void;
}

export function useFoodScreen(): UseFoodScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartCount  = useCartStore((s) => s.itemCount());

  const [searchText,     setSearchTextState]     = useState<string>('');
  const [activeCategory, setActiveCategoryState] = useState<FoodCategory>('All');

  // Pass effective search string to data hook — empty string means no filter.
  const effectiveSearch = searchText.trim() !== '' ? searchText.trim() : undefined;
  const listData = useRestaurantListData(effectiveSearch);

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

  const handleMapPress     = useCallback(() => navigation.navigate('RestaurantMap'),             [navigation]);
  const handleAddressPress = useCallback(() => navigation.navigate('AddressList', { mode: 'manage' }), [navigation]);
  const handleOrdersPress  = useCallback(() => navigation.navigate('FoodOrders'),               [navigation]);
  const handleCartPress    = useCallback(() => navigation.navigate('Cart'),                     [navigation]);
  const handleBack         = useCallback(() => navigation.goBack(),                             [navigation]);

  return {
    ...listData,
    cartItemCount:     cartCount,
    searchText,
    activeCategory,
    setSearchText,
    setActiveCategory,
    handleRestaurantPress,
    handleMapPress,
    handleAddressPress,
    handleOrdersPress,
    handleCartPress,
    handleBack,
  };
}
