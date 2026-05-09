import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRestaurant, updateRestaurant, createRestaurant,
  uploadRestaurantPhoto, removeRestaurantPhoto,
  type OpeningHourInput,
} from '../../../api/restaurant';
import {
  createKycResubmission, uploadResubmitDocument, submitKycResubmission,
  type UploadFileRef,
} from '../../../api/kyc';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { Restaurant, OpeningHour } from '../../../types/models';
import type { KycDocType } from '../../../types/enums';
import type { RestaurantStatus } from '../../../types/enums';

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
}

interface DescriptionForm {
  description: string;
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
  isEditingPhone: boolean;
  isEditingHours: boolean;
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
  handleUploadCoverPhoto: (uri: string, name: string, type: string) => void;
  handleRemoveCoverPhoto: () => void;
  handleUploadLogo: (uri: string, name: string, type: string) => void;
  handleRemoveLogo: () => void;
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
  handleEditHours: () => void;
  handleCancelHours: () => void;
  handleHourChange: (dayOfWeek: number, field: 'opens_at' | 'closes_at', value: string) => void;
  handleHourToggle: (dayOfWeek: number, isClosed: boolean) => void;
  handleSaveHours: () => void;
  handleOpenResubmit: () => void;
  handleCloseResubmit: () => void;
  handleResubmitFieldChange: (field: 'business_name' | 'business_address', value: string) => void;
  handleResubmitSubmitForm: () => void;
  handleResubmitUploadDoc: (type: KycDocType, file: UploadFileRef) => void;
  handleResubmitFinalSubmit: () => void;
}

export function useRestaurantScreen(): UseRestaurantScreenResult {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [minOrderInput, setMinOrderInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [openingHoursInput, setOpeningHoursInput] = useState<OpeningHourInput[]>(DEFAULT_HOURS);
  const [descriptionForm, setDescriptionForm] = useState<DescriptionForm>({ description: '' });
  const [resubmitModal, setResubmitModal] = useState(false);
  const [resubmitForm, setResubmitForm] = useState<ResubmitForm>({
    business_name: '',
    business_address: '',
    resubmissionId: null,
    step: 'form',
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
  });

  const { mutate: saveDelivery, isPending: isSavingDelivery } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: (updated) => { setCache(updated); setIsEditingDelivery(false); },
  });

  const { mutate: savePhone, isPending: isSavingPhone } = useMutation({
    mutationFn: (phone: string) => updateRestaurant({ phone }),
    onSuccess: (updated) => { setCache(updated); setIsEditingPhone(false); },
  });

  const { mutate: saveHours, isPending: isSavingHours } = useMutation({
    mutationFn: (hours: OpeningHourInput[]) => updateRestaurant({ opening_hours: hours }),
    onSuccess: (updated) => { setCache(updated); setIsEditingHours(false); },
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

  const handleToggleStatus = useCallback(
    (status: RestaurantStatus) => save({ status }),
    [save],
  );

  // ── Photos ────────────────────────────────────────────────────────────────────

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

  const handleCancelHours = useCallback(() => setIsEditingHours(false), []);

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
    saveHours(openingHoursInput);
  }, [openingHoursInput, saveHours]);

  // ── KYC resubmission ──────────────────────────────────────────────────────────

  const handleOpenResubmit = useCallback(() => {
    setResubmitForm({
      business_name: restaurant?.name ?? '',
      business_address: restaurant?.address ?? '',
      resubmissionId: null,
      step: 'form',
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

  return {
    restaurant,
    isNewRestaurant,
    isLoading,
    isEditing,
    isSaving: isSaving || isSavingDelivery || isSavingPhone || isSavingHours || isCreatingResubmit,
    isUploadingCover,
    isUploadingLogo,
    isEditingDelivery,
    isEditingPhone,
    isEditingHours,
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
    handleUploadCoverPhoto,
    handleRemoveCoverPhoto,
    handleUploadLogo,
    handleRemoveLogo,
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
    handleEditHours,
    handleCancelHours,
    handleHourChange,
    handleHourToggle,
    handleSaveHours,
    handleOpenResubmit,
    handleCloseResubmit,
    handleResubmitFieldChange,
    handleResubmitSubmitForm,
    handleResubmitUploadDoc,
    handleResubmitFinalSubmit,
  };
}
