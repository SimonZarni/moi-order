import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { UserAddress } from '@/types/models';
import { useAddresses } from './useAddresses';
import { useAddressForm } from './useAddressForm';
import { AddressFormValues } from '../types';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'AddEditAddress'>;

export interface UseAddEditAddressScreenResult {
  isEdit: boolean;
  values: AddressFormValues;
  errors: import('../types').AddressFormErrors;
  isSaving: boolean;
  hasCoordinates: boolean;
  setField: <K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) => void;
  clearCoordinates: () => void;
  handleOpenMap: () => void;
  handleSave: () => void;
  handleBack: () => void;
}

export function useAddEditAddressScreen(): UseAddEditAddressScreenResult {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { addressId, pickedLat, pickedLng, pickedAddress } = route.params ?? {};

  const { addresses, handleCreate, handleUpdate, isCreating, isUpdating } = useAddresses();
  const existing = addressId !== undefined
    ? addresses.find((a: UserAddress) => a.id === addressId)
    : undefined;

  const form = useAddressForm(
    existing
      ? {
          label:     existing.label,
          address:   existing.address,
          building:  existing.building ?? '',
          floor:     existing.floor ?? '',
          landmark:  existing.landmark ?? '',
          latitude:  existing.latitude,
          longitude: existing.longitude,
          isDefault: existing.is_default,
        }
      : undefined,
  );

  // Receive coordinates + address from MapPickerScreen via route params.
  useEffect(() => {
    if (pickedLat !== undefined && pickedLng !== undefined) {
      form.setCoordinates(pickedLat, pickedLng, pickedAddress);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedLat, pickedLng, pickedAddress]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleOpenMap = useCallback(() => {
    const params: RootStackParamList['MapPicker'] = {};
    if (form.values.latitude  !== null) params.initialLat     = form.values.latitude;
    if (form.values.longitude !== null) params.initialLng     = form.values.longitude;
    if (form.values.address)            params.initialAddress = form.values.address;
    navigation.navigate('MapPicker', params);
  }, [navigation, form.values.latitude, form.values.longitude, form.values.address]);

  const handleSave = useCallback(() => {
    if (!form.validate()) return;

    const payload = {
      label:      form.values.label,
      address:    form.values.address.trim(),
      building:   form.values.building.trim() || null,
      floor:      form.values.floor.trim()    || null,
      landmark:   form.values.landmark.trim() || null,
      latitude:   form.values.latitude,
      longitude:  form.values.longitude,
      is_default: form.values.isDefault,
    };

    if (addressId !== undefined) {
      handleUpdate(addressId, payload, {
        onSuccess: () => navigation.goBack(),
        onError:   () => Alert.alert('Error', 'Could not update address. Please try again.'),
      });
    } else {
      handleCreate(payload, {
        onSuccess: () => navigation.goBack(),
        onError:   () => Alert.alert('Error', 'Could not save address. Please try again.'),
      });
    }
  }, [form, addressId, handleCreate, handleUpdate, navigation]);

  return {
    isEdit:          addressId !== undefined,
    values:          form.values,
    errors:          form.errors,
    isSaving:        isCreating || isUpdating,
    hasCoordinates:  form.values.latitude !== null && form.values.longitude !== null,
    setField:        form.setField,
    clearCoordinates: form.clearCoordinates,
    handleOpenMap,
    handleSave,
    handleBack,
  };
}
