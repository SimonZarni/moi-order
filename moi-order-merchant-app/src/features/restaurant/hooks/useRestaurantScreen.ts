import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurant, updateRestaurant } from '../../../api/restaurant';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import { RESTAURANT_STATUS } from '../../../types/enums';
import type { Restaurant } from '../../../types/models';
import type { RestaurantStatus } from '../../../types/enums';

interface EditForm {
  name: string;
  description: string;
  address: string;
  phone: string;
}

interface UseRestaurantScreenResult {
  restaurant: Restaurant | undefined;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  form: EditForm;
  handleStartEdit: () => void;
  handleCancelEdit: () => void;
  handleFieldChange: (field: keyof EditForm, value: string) => void;
  handleSave: () => void;
  handleToggleStatus: (status: RestaurantStatus) => void;
}

export function useRestaurantScreen(): UseRestaurantScreenResult {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  const { data: restaurant, isLoading } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.USER,
  });

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.RESTAURANT, updated);
      setIsEditing(false);
    },
  });

  const handleStartEdit = useCallback(() => {
    setForm({
      name: restaurant?.name ?? '',
      description: restaurant?.description ?? '',
      address: restaurant?.address ?? '',
      phone: restaurant?.phone ?? '',
    });
    setIsEditing(true);
  }, [restaurant]);

  const handleCancelEdit = useCallback(() => setIsEditing(false), []);

  const handleFieldChange = useCallback(
    (field: keyof EditForm, value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handleSave = useCallback(() => {
    save({
      name: form.name.trim() || undefined,
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
    });
  }, [form, save]);

  const handleToggleStatus = useCallback(
    (status: RestaurantStatus) => save({ status }),
    [save],
  );

  return {
    restaurant,
    isLoading,
    isEditing,
    isSaving,
    form,
    handleStartEdit,
    handleCancelEdit,
    handleFieldChange,
    handleSave,
    handleToggleStatus,
  };
}
