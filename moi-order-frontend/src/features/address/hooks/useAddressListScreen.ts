import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { UserAddress } from '@/types/models';
import { useAddresses } from './useAddresses';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'AddressList'>;

export interface UseAddressListScreenResult {
  addresses: UserAddress[];
  isLoading: boolean;
  mode: 'select' | 'manage';
  handleSelect: (address: UserAddress) => void;
  handleAddNew: () => void;
  handleEdit: (address: UserAddress) => void;
  handleDelete: (address: UserAddress) => void;
  handleBack: () => void;
  handleMapPress: () => void;
  isDeleting: boolean;
}

export function useAddressListScreen(): UseAddressListScreenResult {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { mode }   = route.params;

  const { addresses, isLoading, handleDelete: deleteAddress, isDeleting } = useAddresses();

  const handleBack     = useCallback(() => navigation.goBack(),                  [navigation]);
  const handleMapPress = useCallback(() => navigation.navigate('RestaurantMap'), [navigation]);

  const handleSelect = useCallback((address: UserAddress) => {
    navigation.navigate('Checkout', { selectedAddressId: address.id });
  }, [navigation]);

  const handleAddNew = useCallback(() => {
    navigation.navigate('AddEditAddress', {});
  }, [navigation]);

  const handleEdit = useCallback((address: UserAddress) => {
    navigation.navigate('AddEditAddress', { addressId: address.id });
  }, [navigation]);

  const handleDelete = useCallback((address: UserAddress) => {
    Alert.alert(
      'Delete Address',
      `Remove your ${address.label_display} address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAddress(address.id),
        },
      ],
    );
  }, [deleteAddress]);

  return {
    addresses,
    isLoading,
    mode,
    handleSelect,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleBack,
    handleMapPress,
    isDeleting,
  };
}
