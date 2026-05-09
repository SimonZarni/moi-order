import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurant, updateRestaurant, createRestaurant, uploadRestaurantPhoto, removeRestaurantPhoto } from '../../../api/restaurant';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { Restaurant } from '../../../types/models';
import type { RestaurantStatus } from '../../../types/enums';

interface EditForm {
  name: string;
  description: string;
  address: string;
  phone: string;
}

interface UseRestaurantScreenResult {
  restaurant: Restaurant | null | undefined;
  isNewRestaurant: boolean;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isUploadingCover: boolean;
  isUploadingLogo: boolean;
  isEditingDelivery: boolean;
  minOrderInput: string;
  form: EditForm;
  handleStartEdit: () => void;
  handleCancelEdit: () => void;
  handleFieldChange: (field: keyof EditForm, value: string) => void;
  handleSave: () => void;
  handleToggleStatus: (status: RestaurantStatus) => void;
  handleUploadCoverPhoto: (uri: string, name: string, type: string) => void;
  handleRemoveCoverPhoto: () => void;
  handleUploadLogo: (uri: string, name: string, type: string) => void;
  handleRemoveLogo: () => void;
  handleEditDelivery: () => void;
  handleCancelDelivery: () => void;
  handleMinOrderChange: (v: string) => void;
  handleSaveDelivery: () => void;
}

export function useRestaurantScreen(): UseRestaurantScreenResult {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [minOrderInput, setMinOrderInput] = useState('');
  const [form, setForm] = useState<EditForm>({
    name: '',
    description: '',
    address: '',
    phone: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.USER,
  });

  const restaurant = data?.restaurant ?? null;
  const prefill = data?.prefill ?? null;
  const isNewRestaurant = !isLoading && restaurant === null;

  useEffect(() => {
    if (isNewRestaurant && prefill !== null && !isEditing) {
      setForm({
        name: prefill.name ?? '',
        description: '',
        address: prefill.address ?? '',
        phone: prefill.phone ?? '',
      });
      setIsEditing(true);
    }
  }, [isNewRestaurant, prefill, isEditing]);

  const invalidateRestaurant = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESTAURANT });
  }, [queryClient]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (payload: Parameters<typeof updateRestaurant>[0]) =>
      restaurant === null ? createRestaurant(payload) : updateRestaurant(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.RESTAURANT, { restaurant: updated, prefill: null });
      setIsEditing(false);
    },
  });

  const { mutate: saveDelivery, isPending: isSavingDelivery } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.RESTAURANT, { restaurant: updated, prefill: null });
      setIsEditingDelivery(false);
    },
  });

  const { mutate: mutateCoverUpload, isPending: isUploadingCover } = useMutation({
    mutationFn: (formData: FormData) => uploadRestaurantPhoto('cover_photo', formData),
    onSuccess: invalidateRestaurant,
  });

  const { mutate: mutateLogoUpload, isPending: isUploadingLogo } = useMutation({
    mutationFn: (formData: FormData) => uploadRestaurantPhoto('logo', formData),
    onSuccess: invalidateRestaurant,
  });

  const { mutate: mutateCoverRemove } = useMutation({
    mutationFn: () => removeRestaurantPhoto('cover_photo'),
    onSuccess: invalidateRestaurant,
  });

  const { mutate: mutateLogoRemove } = useMutation({
    mutationFn: () => removeRestaurantPhoto('logo'),
    onSuccess: invalidateRestaurant,
  });

  const handleStartEdit = useCallback(() => {
    setForm({
      name: restaurant?.name ?? prefill?.name ?? '',
      description: restaurant?.description ?? '',
      address: restaurant?.address ?? prefill?.address ?? '',
      phone: restaurant?.phone ?? prefill?.phone ?? '',
    });
    setIsEditing(true);
  }, [restaurant, prefill]);

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

  const handleUploadCoverPhoto = useCallback((uri: string, name: string, type: string) => {
    const fd = new FormData();
    fd.append('photo', { uri, name, type } as unknown as Blob);
    mutateCoverUpload(fd);
  }, [mutateCoverUpload]);

  const handleRemoveCoverPhoto = useCallback(() => mutateCoverRemove(), [mutateCoverRemove]);

  const handleUploadLogo = useCallback((uri: string, name: string, type: string) => {
    const fd = new FormData();
    fd.append('photo', { uri, name, type } as unknown as Blob);
    mutateLogoUpload(fd);
  }, [mutateLogoUpload]);

  const handleRemoveLogo = useCallback(() => mutateLogoRemove(), [mutateLogoRemove]);

  const handleEditDelivery = useCallback(() => {
    const displayValue = ((restaurant?.min_order_cents ?? 0) / 100).toFixed(0);
    setMinOrderInput(displayValue);
    setIsEditingDelivery(true);
  }, [restaurant]);

  const handleCancelDelivery = useCallback(() => setIsEditingDelivery(false), []);

  const handleMinOrderChange = useCallback((v: string) => {
    if (/^\d*$/.test(v)) setMinOrderInput(v);
  }, []);

  const handleSaveDelivery = useCallback(() => {
    const cents = Math.round(parseFloat(minOrderInput || '0') * 100);
    if (isNaN(cents) || cents < 0) return;
    saveDelivery({ min_order_cents: cents });
  }, [saveDelivery, minOrderInput]);

  return {
    restaurant,
    isNewRestaurant,
    isLoading,
    isEditing,
    isSaving: isSaving || isSavingDelivery,
    isUploadingCover,
    isUploadingLogo,
    isEditingDelivery,
    minOrderInput,
    form,
    handleStartEdit,
    handleCancelEdit,
    handleFieldChange,
    handleSave,
    handleToggleStatus,
    handleUploadCoverPhoto,
    handleRemoveCoverPhoto,
    handleUploadLogo,
    handleRemoveLogo,
    handleEditDelivery,
    handleCancelDelivery,
    handleMinOrderChange,
    handleSaveDelivery,
  };
}
