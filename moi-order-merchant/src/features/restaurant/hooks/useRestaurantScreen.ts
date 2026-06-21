import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRestaurantLocation } from './useRestaurantLocation';
import {
  getRestaurant, updateRestaurant, createRestaurant,
  setRestaurantStatus,
  uploadRestaurantPhoto, removeRestaurantPhoto,
  uploadRestaurantGalleryPhoto, deleteRestaurantGalleryPhoto, reorderRestaurantGalleryPhotos,
  type OpeningHourInput,
} from '../../../api/restaurant';
import { getMenuCategories } from '../../../api/menu';
import { extractApiError } from '../../../api/client';
import {
  createKycResubmission, uploadResubmitDocument, submitKycResubmission,
  useExistingDocumentsForResubmission,
  type UploadFileRef,
} from '../../../api/kyc';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import { DOMAIN_MESSAGES } from '../../../shared/constants/messages';
import type { Restaurant, OpeningHour, MenuCategory } from '../../../types/models';
import type { KycDocType, RestaurantStatus } from '../../../types/enums';
import { RESTAURANT_STATUS } from '../../../types/enums';

const REQUIRED_MENU_TYPES = ['popular_picks', 'recommendations'] as const;
const REQUIRED_MENU_LABELS: Record<string, string> = {
  popular_picks: 'Popular Picks',
  recommendations: 'Recommendations',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

const DEFAULT_HOURS: OpeningHourInput[] = DAYS.map((_, i) => ({
  day_of_week: i,
  opens_at: '09:00',
  closes_at: '22:00',
  is_closed: false,
}));

export interface ResubmitForm {
  business_name: string;
  business_address: string;
  resubmissionId: number | null;
  step: 'form' | 'docs' | 'submitting' | 'done';
  uploadedDocTypes: string[];
}

interface DescriptionForm {
  description: string;
}

interface UseRestaurantScreenResult {
  restaurant: Restaurant | null;
  isNewRestaurant: boolean;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isUploadingCover: boolean;
  isUploadingLogo: boolean;
  isUploadingGalleryPhoto: boolean;
  isEditingDelivery: boolean;
  isEditingPhone: boolean;
  isEditingHours: boolean;
  hoursError: string | null;
  minOrderInput: string;
  phoneInput: string;
  openingHoursInput: OpeningHourInput[];
  descriptionForm: DescriptionForm;
  resubmitModal: boolean;
  resubmitForm: ResubmitForm;
  days: readonly string[];
  handleStartEdit: () => void;
  handleCancelEdit: () => void;
  handleDescriptionChange: (v: string) => void;
  handleSave: () => void;
  handleToggleStatus: (status: RestaurantStatus) => void;
  isTogglingStatus: boolean;
  overrideActive: boolean;
  overrideUntil: string | null;
  statusWarning: string | null;
  handleDismissStatusWarning: () => void;
  handleUploadCoverPhoto: (uri: string, name: string, type: string) => void;
  handleRemoveCoverPhoto: () => void;
  handleUploadLogo: (uri: string, name: string, type: string) => void;
  handleRemoveLogo: () => void;
  handleUploadGalleryPhoto: (uri: string, name: string, type: string) => void;
  handleRemoveGalleryPhoto: (photoId: number) => void;
  handleMoveGalleryPhoto: (photoId: number, direction: 'up' | 'down') => void;
  handleEditDelivery: () => void;
  handleCancelDelivery: () => void;
  handleMinOrderChange: (v: string) => void;
  handleSaveDelivery: () => void;
  handleToggleDelivery: (v: boolean) => void;
  handleTogglePickup: (v: boolean) => void;
  handleEditPhone: () => void;
  handleCancelPhone: () => void;
  handlePhoneChange: (v: string) => void;
  handleSavePhone: () => void;
  isEditingLocation: boolean;
  locationInput: { latitude: number | null; longitude: number | null };
  isLocating: boolean;
  locationError: string | null;
  handleEditLocation: () => void;
  handleCancelLocation: () => void;
  handleGetLocation: () => void;
  handleClearLocation: () => void;
  handleSaveLocation: () => void;
  handleEditHours: () => void;
  handleCancelHours: () => void;
  handleClearHoursError: () => void;
  handleHourChange: (dayOfWeek: number, field: 'opens_at' | 'closes_at', value: string) => void;
  handleHourToggle: (dayOfWeek: number, isClosed: boolean) => void;
  handleSaveHours: () => void;
  handleOpenResubmit: () => void;
  handleCloseResubmit: () => void;
  handleResubmitFieldChange: (field: 'business_name' | 'business_address', value: string) => void;
  handleResubmitSubmitForm: () => void;
  handleResubmitUploadDoc: (type: KycDocType, file: UploadFileRef) => void;
  handleResubmitFinalSubmit: () => void;
  handleUseExistingDocs: () => void;
  isUsingExistingDocs: boolean;
}

export function useRestaurantScreen(): UseRestaurantScreenResult {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);
  const [minOrderInput, setMinOrderInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [openingHoursInput, setOpeningHoursInput] = useState<OpeningHourInput[]>(DEFAULT_HOURS);
  const [descriptionForm, setDescriptionForm] = useState<DescriptionForm>({ description: '' });
  const [resubmitModal, setResubmitModal] = useState(false);
  const [statusWarning, setStatusWarning] = useState<string | null>(null);
  const [resubmitForm, setResubmitForm] = useState<ResubmitForm>({
    business_name: '',
    business_address: '',
    resubmissionId: null,
    step: 'form',
    uploadedDocTypes: [],
  });

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.USER,
  });

  const restaurant = data?.restaurant ?? null;
  const isNewRestaurant = !isLoading && restaurant === null;

  const invalidateRestaurant = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESTAURANT });
  }, [queryClient]);

  const setCache = useCallback((updated: Restaurant) => {
    queryClient.setQueryData(QUERY_KEYS.RESTAURANT, { restaurant: updated, prefill: null });
  }, [queryClient]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (payload: Parameters<typeof updateRestaurant>[0]) =>
      restaurant === null ? createRestaurant(payload) : updateRestaurant(payload),
    onSuccess: (updated) => { setCache(updated); setIsEditing(false); },
    onError: (error) => {
      const apiError = extractApiError(error);
      const message = apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined;
      if (message) setStatusWarning(message);
    },
  });

  const { mutate: saveDelivery, isPending: isSavingDelivery } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: (updated) => { setCache(updated); setIsEditingDelivery(false); },
  });

  const { mutate: savePhone, isPending: isSavingPhone } = useMutation({
    mutationFn: (phone: string) => updateRestaurant({ phone }),
    onSuccess: (updated) => { setCache(updated); setIsEditingPhone(false); },
  });

  const { isLocating, locationError, getLocation } = useRestaurantLocation();

  const { mutate: saveLocation, isPending: isSavingLocation } = useMutation({
    mutationFn: (payload: { latitude: number | null; longitude: number | null }) => updateRestaurant(payload),
    onSuccess: (updated) => { setCache(updated); setIsEditingLocation(false); },
  });

  const { mutate: saveHours, isPending: isSavingHours } = useMutation({
    mutationFn: (hours: OpeningHourInput[]) => updateRestaurant({ opening_hours: hours }),
    onSuccess: (updated) => { setCache(updated); setIsEditingHours(false); setHoursError(null); },
    onError: (error) => {
      const apiError = extractApiError(error);
      setHoursError(apiError.message ?? 'Could not save opening hours. Check the time format (HH:MM).');
    },
  });

  const { mutate: mutateStatus, isPending: isTogglingStatus } = useMutation({
    mutationFn: (status: RestaurantStatus) => setRestaurantStatus(status),
    onSuccess: (updated) => { setCache(updated); },
    onError: (error) => {
      const apiError = extractApiError(error);
      const message = apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined;
      if (message) setStatusWarning(message);
    },
  });

  const { mutate: mutateToggleDelivery } = useMutation({
    mutationFn: (v: boolean) => updateRestaurant({ is_delivery_available: v }),
    onSuccess: (updated) => { setCache(updated); },
  });

  const { mutate: mutateTogglePickup } = useMutation({
    mutationFn: (v: boolean) => updateRestaurant({ is_pickup_available: v }),
    onSuccess: (updated) => { setCache(updated); },
  });

  const { mutate: mutateCoverUpload, isPending: isUploadingCover } = useMutation({
    mutationFn: (fd: FormData) => uploadRestaurantPhoto('cover_photo', fd),
    onSuccess: invalidateRestaurant,
  });

  const { mutate: mutateLogoUpload, isPending: isUploadingLogo } = useMutation({
    mutationFn: (fd: FormData) => uploadRestaurantPhoto('logo', fd),
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

  const { mutate: mutateGalleryUpload, isPending: isUploadingGalleryPhoto } = useMutation({
    mutationFn: (fd: FormData) => uploadRestaurantGalleryPhoto(fd),
    onSuccess: setCache,
    onError: (error) => {
      const apiError = extractApiError(error);
      const message = apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined;
      if (message) setStatusWarning(message);
    },
  });

  const { mutate: mutateGalleryRemove } = useMutation({
    mutationFn: (photoId: number) => deleteRestaurantGalleryPhoto(photoId),
    onSuccess: setCache,
  });

  const { mutate: mutateGalleryReorder } = useMutation({
    mutationFn: (ids: number[]) => reorderRestaurantGalleryPhotos(ids),
    onSuccess: setCache,
  });

  const { mutate: mutateResubmitCreate, isPending: isCreatingResubmit } = useMutation({
    mutationFn: ({ name, address }: { name: string; address: string }) =>
      createKycResubmission(name, address),
    onSuccess: (app) => {
      setResubmitForm((prev) => ({ ...prev, resubmissionId: app.id, step: 'docs' }));
    },
  });

  const { mutate: mutateResubmitDoc } = useMutation({
    mutationFn: ({ id, type, file }: { id: number; type: KycDocType; file: UploadFileRef }) =>
      uploadResubmitDocument(id, type, file),
    onSuccess: (doc) => {
      setResubmitForm((prev) => ({
        ...prev,
        uploadedDocTypes: [...prev.uploadedDocTypes.filter((t) => t !== doc.type), doc.type],
      }));
    },
  });

  const { mutate: mutateUseExistingDocs, isPending: isUsingExistingDocs } = useMutation({
    mutationFn: (id: number) => useExistingDocumentsForResubmission(id),
    onSuccess: (app) => {
      setResubmitForm((prev) => ({
        ...prev,
        uploadedDocTypes: app.documents.map((d) => d.type),
      }));
    },
  });

  const { mutate: mutateResubmitSubmit } = useMutation({
    mutationFn: (id: number) => submitKycResubmission(id),
    onSuccess: () => {
      setResubmitForm((prev) => ({ ...prev, step: 'done' }));
    },
  });

  const hoursFromRestaurant = useMemo((): OpeningHourInput[] => {
    if (!restaurant?.opening_hours?.length) return DEFAULT_HOURS;
    return DEFAULT_HOURS.map((def) => {
      const existing = restaurant.opening_hours?.find((h) => h.day_of_week === def.day_of_week);
      return existing ? { ...existing } : def;
    });
  }, [restaurant]);

  // ── Description ──────────────────────────────────────────────────────────────

  const handleStartEdit = useCallback(() => {
    setDescriptionForm({ description: restaurant?.description ?? '' });
    setIsEditing(true);
  }, [restaurant]);

  const handleCancelEdit = useCallback(() => setIsEditing(false), []);

  const handleDescriptionChange = useCallback(
    (v: string) => setDescriptionForm({ description: v }),
    [],
  );

  const handleSave = useCallback(() => {
    save({ description: descriptionForm.description.trim() || undefined });
  }, [descriptionForm, save]);

  // ── Status ────────────────────────────────────────────────────────────────────

  const handleToggleStatus = useCallback((status: RestaurantStatus) => {
    // Client-side guard: block opening if required system categories are empty.
    // The server validates this too (validateOpenReady), but we surface a clear
    // message before the round-trip so the merchant knows what to fix.
    if (status === RESTAURANT_STATUS.Open) {
      void (async () => {
        const menuData = await queryClient.ensureQueryData<MenuCategory[]>({
          queryKey: QUERY_KEYS.MENU_CATEGORIES,
          queryFn: getMenuCategories,
          staleTime: CACHE_TTL.MENU,
        });
        const emptyRequired = REQUIRED_MENU_TYPES.filter((type) => {
          const cat = menuData.find((c) => c.is_system && c.category_type === type);
          return !cat || (cat.items ?? []).length === 0;
        });
        if (emptyRequired.length > 0) {
          const labels = emptyRequired.map((t) => REQUIRED_MENU_LABELS[t]).join(' and ');
          setStatusWarning(`Add at least 1 item to ${labels} before opening your restaurant.`);
          return;
        }
        mutateStatus(status);
      })();
      return;
    }
    mutateStatus(status);
  }, [mutateStatus, queryClient]);

  const handleDismissStatusWarning = useCallback(() => setStatusWarning(null), []);

  // ── Photos ────────────────────────────────────────────────────────────────────

  const handleUploadCoverPhoto = useCallback((uri: string, name: string, type: string) => {
    void (async () => {
      const fd = new FormData();
      if (Platform.OS === 'web') {
        const blob = await fetch(uri).then((r) => r.blob());
        if (uri.startsWith('blob:')) URL.revokeObjectURL(uri);
        fd.append('photo', new File([blob], name, { type }));
      } else {
        fd.append('photo', { uri, name, type } as unknown as Blob);
      }
      mutateCoverUpload(fd);
    })();
  }, [mutateCoverUpload]);

  const handleRemoveCoverPhoto = useCallback(() => mutateCoverRemove(), [mutateCoverRemove]);

  const handleUploadLogo = useCallback((uri: string, name: string, type: string) => {
    void (async () => {
      const fd = new FormData();
      if (Platform.OS === 'web') {
        const blob = await fetch(uri).then((r) => r.blob());
        if (uri.startsWith('blob:')) URL.revokeObjectURL(uri);
        fd.append('photo', new File([blob], name, { type }));
      } else {
        fd.append('photo', { uri, name, type } as unknown as Blob);
      }
      mutateLogoUpload(fd);
    })();
  }, [mutateLogoUpload]);

  const handleRemoveLogo = useCallback(() => mutateLogoRemove(), [mutateLogoRemove]);

  const handleUploadGalleryPhoto = useCallback((uri: string, name: string, type: string) => {
    void (async () => {
      const fd = new FormData();
      if (Platform.OS === 'web') {
        const blob = await fetch(uri).then((r) => r.blob());
        if (uri.startsWith('blob:')) URL.revokeObjectURL(uri);
        fd.append('photo', new File([blob], name, { type }));
      } else {
        fd.append('photo', { uri, name, type } as unknown as Blob);
      }
      mutateGalleryUpload(fd);
    })();
  }, [mutateGalleryUpload]);

  const handleRemoveGalleryPhoto = useCallback(
    (photoId: number) => mutateGalleryRemove(photoId),
    [mutateGalleryRemove],
  );

  const handleMoveGalleryPhoto = useCallback((photoId: number, direction: 'up' | 'down') => {
    if (!restaurant) return;
    const sorted = [...restaurant.photos].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((p) => p.id === photoId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    mutateGalleryReorder(reordered.map((p) => p.id));
  }, [restaurant, mutateGalleryReorder]);

  // ── Phone ─────────────────────────────────────────────────────────────────────

  const handleEditPhone = useCallback(() => {
    setPhoneInput(restaurant?.phone ?? '');
    setIsEditingPhone(true);
  }, [restaurant]);

  const handleCancelPhone = useCallback(() => setIsEditingPhone(false), []);
  const handlePhoneChange = useCallback((v: string) => setPhoneInput(v), []);
  const handleSavePhone = useCallback(() => {
    savePhone(phoneInput.trim());
  }, [phoneInput, savePhone]);

  // ── Location ──────────────────────────────────────────────────────────────────

  const handleEditLocation = useCallback(() => {
    setLocationInput({ latitude: restaurant?.latitude ?? null, longitude: restaurant?.longitude ?? null });
    setIsEditingLocation(true);
  }, [restaurant]);

  const handleCancelLocation = useCallback(() => setIsEditingLocation(false), []);

  const handleGetLocation = useCallback(() => {
    getLocation(({ latitude, longitude }) => setLocationInput({ latitude, longitude }));
  }, [getLocation]);

  const handleClearLocation = useCallback(() => setLocationInput({ latitude: null, longitude: null }), []);

  const handleSaveLocation = useCallback(() => {
    saveLocation(locationInput);
  }, [saveLocation, locationInput]);

  // ── Delivery settings ─────────────────────────────────────────────────────────

  const handleEditDelivery = useCallback(() => {
    setMinOrderInput(((restaurant?.min_order_cents ?? 0) / 100).toFixed(0));
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

  const handleToggleDelivery = useCallback(
    (v: boolean) => mutateToggleDelivery(v),
    [mutateToggleDelivery],
  );

  const handleTogglePickup = useCallback(
    (v: boolean) => mutateTogglePickup(v),
    [mutateTogglePickup],
  );

  // ── Opening hours ─────────────────────────────────────────────────────────────

  const handleEditHours = useCallback(() => {
    setOpeningHoursInput(hoursFromRestaurant);
    setIsEditingHours(true);
  }, [hoursFromRestaurant]);

  const handleCancelHours = useCallback(() => { setIsEditingHours(false); setHoursError(null); }, []);
  const handleClearHoursError = useCallback(() => setHoursError(null), []);

  const handleHourChange = useCallback(
    (dayOfWeek: number, field: 'opens_at' | 'closes_at', value: string) => {
      setOpeningHoursInput((prev) =>
        prev.map((h) => h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h),
      );
    },
    [],
  );

  const handleHourToggle = useCallback((dayOfWeek: number, isClosed: boolean) => {
    setOpeningHoursInput((prev) =>
      prev.map((h) => h.day_of_week === dayOfWeek ? { ...h, is_closed: isClosed } : h),
    );
  }, []);

  const handleSaveHours = useCallback(() => {
    const normalizeTime = (t: string | null): string | null => {
      if (!t) return null;
      const [h, m] = t.split(':');
      if (!h || !m) return t;
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    };
    const normalized = openingHoursInput.map((h) => ({
      ...h,
      opens_at:  h.is_closed ? null : normalizeTime(h.opens_at),
      closes_at: h.is_closed ? null : normalizeTime(h.closes_at),
    }));
    saveHours(normalized);
  }, [openingHoursInput, saveHours]);

  // ── KYC resubmission ──────────────────────────────────────────────────────────

  const handleOpenResubmit = useCallback(() => {
    setResubmitForm({
      business_name: restaurant?.name ?? '',
      business_address: restaurant?.address ?? '',
      resubmissionId: null,
      step: 'form',
      uploadedDocTypes: [],
    });
    setResubmitModal(true);
  }, [restaurant]);

  const handleCloseResubmit = useCallback(() => setResubmitModal(false), []);

  const handleResubmitFieldChange = useCallback(
    (field: 'business_name' | 'business_address', value: string) => {
      setResubmitForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleResubmitSubmitForm = useCallback(() => {
    if (!resubmitForm.business_name.trim() || !resubmitForm.business_address.trim()) return;
    mutateResubmitCreate({
      name: resubmitForm.business_name.trim(),
      address: resubmitForm.business_address.trim(),
    });
  }, [resubmitForm, mutateResubmitCreate]);

  const handleResubmitUploadDoc = useCallback(
    (type: KycDocType, file: UploadFileRef) => {
      if (resubmitForm.resubmissionId === null) return;
      mutateResubmitDoc({ id: resubmitForm.resubmissionId, type, file });
    },
    [resubmitForm.resubmissionId, mutateResubmitDoc],
  );

  const handleResubmitFinalSubmit = useCallback(() => {
    if (resubmitForm.resubmissionId === null) return;
    setResubmitForm((prev) => ({ ...prev, step: 'submitting' }));
    mutateResubmitSubmit(resubmitForm.resubmissionId);
  }, [resubmitForm.resubmissionId, mutateResubmitSubmit]);

  const handleUseExistingDocs = useCallback(() => {
    if (resubmitForm.resubmissionId === null) return;
    mutateUseExistingDocs(resubmitForm.resubmissionId);
  }, [resubmitForm.resubmissionId, mutateUseExistingDocs]);

  return {
    restaurant,
    isNewRestaurant,
    isLoading,
    isEditing,
    isSaving: isSaving || isSavingDelivery || isSavingPhone || isSavingLocation || isSavingHours || isCreatingResubmit,
    isUploadingCover,
    isUploadingLogo,
    isUploadingGalleryPhoto,
    isEditingDelivery,
    isEditingPhone,
    isEditingHours,
    hoursError,
    minOrderInput,
    phoneInput,
    openingHoursInput,
    descriptionForm,
    resubmitModal,
    resubmitForm,
    days: DAYS,
    handleStartEdit,
    handleCancelEdit,
    handleDescriptionChange,
    handleSave,
    handleToggleStatus,
    isTogglingStatus,
    overrideActive: restaurant?.override_active ?? false,
    overrideUntil: restaurant?.override_until ?? null,
    statusWarning,
    handleDismissStatusWarning,
    handleUploadCoverPhoto,
    handleRemoveCoverPhoto,
    handleUploadLogo,
    handleRemoveLogo,
    handleUploadGalleryPhoto,
    handleRemoveGalleryPhoto,
    handleMoveGalleryPhoto,
    handleEditDelivery,
    handleCancelDelivery,
    handleMinOrderChange,
    handleSaveDelivery,
    handleToggleDelivery,
    handleTogglePickup,
    handleEditPhone,
    handleCancelPhone,
    handlePhoneChange,
    handleSavePhone,
    isEditingLocation,
    locationInput,
    isLocating,
    locationError,
    handleEditLocation,
    handleCancelLocation,
    handleGetLocation,
    handleClearLocation,
    handleSaveLocation,
    handleEditHours,
    handleCancelHours,
    handleClearHoursError,
    handleHourChange,
    handleHourToggle,
    handleSaveHours,
    handleOpenResubmit,
    handleCloseResubmit,
    handleResubmitFieldChange,
    handleResubmitSubmitForm,
    handleResubmitUploadDoc,
    handleResubmitFinalSubmit,
    handleUseExistingDocs,
    isUsingExistingDocs,
  };
}
