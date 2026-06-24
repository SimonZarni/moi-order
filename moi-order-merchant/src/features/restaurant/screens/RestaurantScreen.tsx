import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Switch, TextInput, ActivityIndicator,
  Image, Linking, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRestaurantScreen } from '../hooks/useRestaurantScreen';
import { CoverPhotoCropModal } from '../components/CoverPhotoCropModal';
import { styles } from './RestaurantScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { RESTAURANT_STATUS, KYC_DOC_TYPE } from '../../../types/enums';
import type { RestaurantStatus, KycDocType } from '../../../types/enums';
import { MAX_GALLERY_PHOTOS } from '../../../shared/constants/config';
import { normalizePickedImage } from '../../../shared/utils/imageUtils';
import { useTranslation } from '../../../shared/hooks/useTranslation';

const LINE_OA_URL = 'https://line.me/R/ti/p/%40moiorder';

const STATUS_CONFIG: Record<RestaurantStatus, { label: string; color: string; bg: string }> = {
  [RESTAURANT_STATUS.Open]:   { label: '🟢 Open',   color: colours.success,  bg: colours.successBg },
  [RESTAURANT_STATUS.Closed]: { label: '🔴 Closed', color: colours.error,    bg: colours.errorBg },
  [RESTAURANT_STATUS.Paused]: { label: '🟡 Paused', color: colours.warning,  bg: colours.warningBg },
};

interface RestaurantScreenProps {
  onReviewsPress?: () => void;
}

export function RestaurantScreen({ onReviewsPress }: RestaurantScreenProps): React.JSX.Element {
  const {
    restaurant, isLoading, isEditing, isSaving, isNewRestaurant,
    isUploadingCover, isUploadingLogo, isUploadingGalleryPhoto,
    isEditingDelivery, isEditingPhone, /* isEditingHours, */
    minOrderInput, phoneInput, /* openingHoursInput, */ descriptionForm,
    resubmitModal, resubmitForm,
    handleStartEdit, handleCancelEdit, handleDescriptionChange, handleSave,
    handleToggleStatus, isTogglingStatus, overrideActive, overrideUntil,
    handleUploadCoverPhoto, handleRemoveCoverPhoto,
    handleUploadLogo, handleRemoveLogo,
    handleUploadGalleryPhoto, handleRemoveGalleryPhoto, handleMoveGalleryPhoto,
    handleEditDelivery, handleCancelDelivery, handleMinOrderChange, handleSaveDelivery,
    handleEditPhone, handleCancelPhone, handlePhoneChange, handleSavePhone,
    isEditingLocation, locationInput, isLocating, locationError,
    handleEditLocation, handleCancelLocation, handleGetLocation, handleClearLocation, handleSaveLocation,
    // handleEditHours, handleCancelHours, handleClearHoursError, handleHourChange, handleHourToggle, handleSaveHours,
    // hoursError,
    handleOpenResubmit, handleCloseResubmit,
    handleResubmitFieldChange, handleResubmitSubmitForm,
    handleResubmitUploadDoc, handleResubmitFinalSubmit,
    handleUseExistingDocs, isUsingExistingDocs,
    statusWarning, handleDismissStatusWarning,
    handleToggleStockSystem,
  } = useRestaurantScreen();

  const t = useTranslation();

  // const DAY_SHORT = [
  //   t('hours_day_sun'), t('hours_day_mon'), t('hours_day_tue'), t('hours_day_wed'),
  //   t('hours_day_thu'), t('hours_day_fri'), t('hours_day_sat'),
  // ];

  const RESUBMIT_DOC_TYPES: Array<{ type: KycDocType; label: string }> = [
    { type: KYC_DOC_TYPE.NationalId,           label: t('kyc_doc_national_id') },
    { type: KYC_DOC_TYPE.BusinessRegistration, label: t('kyc_doc_business_reg') },
    { type: KYC_DOC_TYPE.BankBook,             label: t('kyc_doc_bank_book') },
    { type: KYC_DOC_TYPE.StorefrontPhoto,      label: t('kyc_doc_storefront') },
  ];

  const pickAndConvert = useCallback(async (
    onPick: (uri: string, name: string, type: string) => void,
    baseName: string,
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8 });
    if (result.canceled || !result.assets[0]) return;
    const img = await normalizePickedImage(result.assets[0], baseName);
    onPick(img.uri, img.name, img.type);
  }, []);

  const [coverCropSource, setCoverCropSource] = useState<{
    uri: string; name: string; type: string; width: number; height: number;
  } | null>(null);

  const handlePickCoverPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 1 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const img = await normalizePickedImage(asset, 'cover');
    setCoverCropSource({ uri: img.uri, name: img.name, type: img.type, width: asset.width ?? 1200, height: asset.height ?? 675 });
  }, []);

  const handleCoverCropDone = useCallback((croppedUri: string) => {
    if (coverCropSource === null) return;
    const croppedName = coverCropSource.name.replace(/\.[^.]+$/, '.jpg');
    if (coverCropSource.uri.startsWith('blob:')) URL.revokeObjectURL(coverCropSource.uri);
    handleUploadCoverPhoto(croppedUri, croppedName, 'image/jpeg');
    setCoverCropSource(null);
  }, [coverCropSource, handleUploadCoverPhoto]);

  const handleCoverCropCancel = useCallback(() => {
    if (coverCropSource?.uri.startsWith('blob:')) URL.revokeObjectURL(coverCropSource.uri);
    setCoverCropSource(null);
  }, [coverCropSource]);

  const handlePickLogo = useCallback(async () => {
    await pickAndConvert(handleUploadLogo, 'logo');
  }, [pickAndConvert, handleUploadLogo]);

  const handlePickGalleryPhoto = useCallback(async () => {
    await pickAndConvert(handleUploadGalleryPhoto, 'gallery');
  }, [pickAndConvert, handleUploadGalleryPhoto]);

  const handlePickResubmitDoc = useCallback(async (docType: KycDocType) => {
    await pickAndConvert(
      (uri, name, type) => handleResubmitUploadDoc(docType, { uri, name, type }),
      docType,
    );
  }, [pickAndConvert, handleResubmitUploadDoc]);

  const handleContactSupport = useCallback(() => {
    Linking.openURL(LINE_OA_URL).catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  const currentStatus = restaurant?.status ?? RESTAURANT_STATUS.Closed;
  const statusConfig = STATUS_CONFIG[currentStatus];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{isNewRestaurant ? t('restaurant_setup_title') : t('restaurant_title')}</Text>
          {!isEditing && restaurant !== null && (
            <Pressable style={styles.editButton} onPress={handleStartEdit}
              accessibilityLabel="Edit description" accessibilityRole="button">
              <Ionicons name="pencil-outline" size={14} color={colours.backgroundDark} />
              <Text style={styles.editButtonText}>{t('restaurant_edit_description')}</Text>
            </Pressable>
          )}
        </View>

        {/* Status */}
        {restaurant !== null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('restaurant_status_card')}</Text>
            </View>
            {statusWarning !== null && (
              <View style={styles.statusWarningBar}>
                <Ionicons name="warning-outline" size={14} color={colours.warning} />
                <Text style={styles.statusWarningText}>{statusWarning}</Text>
                <Pressable onPress={handleDismissStatusWarning} accessibilityRole="button" accessibilityLabel="Dismiss warning">
                  <Ionicons name="close" size={16} color={colours.textMuted} />
                </Pressable>
              </View>
            )}
            <View style={styles.statusRow}>
              {(Object.values(RESTAURANT_STATUS) as RestaurantStatus[]).map((s) => {
                const cfg = STATUS_CONFIG[s];
                const isActive = currentStatus === s;
                return (
                  <Pressable key={s}
                    style={[styles.statusChip, isActive && [styles.statusChipActive, { backgroundColor: cfg.bg }], isTogglingStatus && styles.statusChipDisabled]}
                    onPress={() => { if (!isTogglingStatus) handleToggleStatus(s); }}
                    accessibilityLabel={`Set status to ${s}`} accessibilityRole="button"
                    disabled={isTogglingStatus}>
                    <Text style={[styles.statusChipText, isActive && { color: cfg.color }]}>{cfg.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            {overrideActive && overrideUntil !== null && (
              <View style={styles.overrideBadge}>
                <Ionicons name="time-outline" size={12} color={colours.primary} />
                <Text style={styles.overrideBadgeText}>
                  {'The shop will follow schedule at '}
                  {new Date(overrideUntil).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  {' (3 hr)'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Photos */}
        {restaurant !== null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}><Text style={styles.cardTitle}>{t('restaurant_photos_card')}</Text></View>
            <View style={styles.cardBody}>
              <Text style={styles.infoLabel}>{t('restaurant_cover_photo')}</Text>
              {restaurant.cover_photo_url != null ? (
                <View style={styles.photoRow}>
                  <Image source={{ uri: restaurant.cover_photo_url }} style={styles.photoPreview} resizeMode="cover" />
                  <View style={styles.photoActions}>
                    <Pressable style={styles.photoBtn} onPress={handlePickCoverPhoto} disabled={isUploadingCover}
                      accessibilityRole="button" accessibilityLabel="Change cover photo">
                      {isUploadingCover ? <ActivityIndicator size="small" color={colours.primary} /> : <Text style={styles.photoBtnText}>{t('common_change')}</Text>}
                    </Pressable>
                    <Pressable style={[styles.photoBtn, styles.photoBtnDanger]} onPress={handleRemoveCoverPhoto}
                      accessibilityRole="button" accessibilityLabel="Remove cover photo">
                      <Text style={[styles.photoBtnText, { color: colours.error }]}>{t('common_remove')}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={styles.photoUploadBtn} onPress={handlePickCoverPhoto} disabled={isUploadingCover}
                  accessibilityRole="button" accessibilityLabel="Upload cover photo">
                  {isUploadingCover ? <ActivityIndicator size="small" color={colours.primary} /> : (
                    <><Ionicons name="image-outline" size={18} color={colours.primary} /><Text style={styles.photoBtnText}>{t('restaurant_upload_cover')}</Text></>
                  )}
                </Pressable>
              )}
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>{t('restaurant_logo_label')}</Text>
              {restaurant.logo_url != null ? (
                <View style={styles.photoRow}>
                  <Image source={{ uri: restaurant.logo_url }} style={styles.logoPreview} resizeMode="cover" />
                  <View style={styles.photoActions}>
                    <Pressable style={styles.photoBtn} onPress={handlePickLogo} disabled={isUploadingLogo}
                      accessibilityRole="button" accessibilityLabel="Change logo">
                      {isUploadingLogo ? <ActivityIndicator size="small" color={colours.primary} /> : <Text style={styles.photoBtnText}>{t('common_change')}</Text>}
                    </Pressable>
                    <Pressable style={[styles.photoBtn, styles.photoBtnDanger]} onPress={handleRemoveLogo}
                      accessibilityRole="button" accessibilityLabel="Remove logo">
                      <Text style={[styles.photoBtnText, { color: colours.error }]}>{t('common_remove')}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={styles.photoUploadBtn} onPress={handlePickLogo} disabled={isUploadingLogo}
                  accessibilityRole="button" accessibilityLabel="Upload logo">
                  {isUploadingLogo ? <ActivityIndicator size="small" color={colours.primary} /> : (
                    <><Ionicons name="image-outline" size={18} color={colours.primary} /><Text style={styles.photoBtnText}>{t('restaurant_upload_logo')}</Text></>
                  )}
                </Pressable>
              )}
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>Gallery ({restaurant.photos.length}/{MAX_GALLERY_PHOTOS})</Text>
              <View style={styles.galleryRow}>
                {[...restaurant.photos].sort((a, b) => a.sort_order - b.sort_order).map((photo, index, sorted) => (
                  <View key={photo.id} style={styles.galleryItem}>
                    <Image source={{ uri: photo.url }} style={styles.galleryPreview} resizeMode="cover" />
                    <View style={styles.galleryActions}>
                      <Pressable style={styles.galleryActionBtn} onPress={() => handleMoveGalleryPhoto(photo.id, 'up')}
                        disabled={index === 0} accessibilityRole="button" accessibilityLabel="Move photo earlier">
                        <Ionicons name="arrow-up" size={14} color={index === 0 ? colours.textSubtle : colours.textMuted} />
                      </Pressable>
                      <Pressable style={styles.galleryActionBtn} onPress={() => handleMoveGalleryPhoto(photo.id, 'down')}
                        disabled={index === sorted.length - 1} accessibilityRole="button" accessibilityLabel="Move photo later">
                        <Ionicons name="arrow-down" size={14} color={index === sorted.length - 1 ? colours.textSubtle : colours.textMuted} />
                      </Pressable>
                      <Pressable style={[styles.galleryActionBtn, styles.galleryActionBtnDanger]} onPress={() => handleRemoveGalleryPhoto(photo.id)}
                        accessibilityRole="button" accessibilityLabel="Remove gallery photo">
                        <Ionicons name="trash-outline" size={14} color={colours.error} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
              {restaurant.photos.length < MAX_GALLERY_PHOTOS ? (
                <Pressable style={styles.photoUploadBtn} onPress={handlePickGalleryPhoto} disabled={isUploadingGalleryPhoto}
                  accessibilityRole="button" accessibilityLabel="Add gallery photo">
                  {isUploadingGalleryPhoto ? <ActivityIndicator size="small" color={colours.primary} /> : (
                    <><Ionicons name="image-outline" size={18} color={colours.primary} /><Text style={styles.photoBtnText}>{t('restaurant_add_gallery')}</Text></>
                  )}
                </Pressable>
              ) : (
                <Text style={styles.galleryCount}>Maximum of {MAX_GALLERY_PHOTOS} gallery photos reached.</Text>
              )}
            </View>
          </View>
        )}

        {/* Profile card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}><Text style={styles.cardTitle}>{t('restaurant_profile_card')}</Text></View>
          <View style={styles.cardBody}>

            {/* Name — read-only, locked by KYC */}
            <InfoRow label={t('restaurant_name_label')} value={restaurant?.name ?? '—'} />
            <View style={styles.divider} />

            {/* Address — read-only, locked by KYC */}
            <InfoRow label={t('restaurant_address_label')} value={restaurant?.address ?? '—'} />
            <View style={styles.divider} />

            {/* GPS Location — editable */}
            {isEditingLocation ? (
              <View>
                <Text style={styles.inputLabel}>GPS Location</Text>
                {locationInput.latitude !== null ? (
                  <View style={styles.locationPreview}>
                    <Ionicons name="location-outline" size={14} color={colours.primary} />
                    <Text style={styles.locationPreviewText}>
                      {locationInput.latitude.toFixed(6)}, {locationInput.longitude?.toFixed(6)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.locationEmpty}>No location set — tap below to get your GPS coordinates.</Text>
                )}
                {locationError !== null && (
                  <Text style={styles.locationErrorText}>{locationError}</Text>
                )}
                <View style={styles.locationActions}>
                  <Pressable style={styles.locationGetBtn} onPress={handleGetLocation}
                    disabled={isLocating} accessibilityRole="button" accessibilityLabel="Get current location">
                    {isLocating
                      ? <ActivityIndicator size="small" color={colours.primary} />
                      : <><Ionicons name="navigate-outline" size={15} color={colours.primary} /><Text style={styles.locationGetBtnText}>Use Current Location</Text></>
                    }
                  </Pressable>
                  {locationInput.latitude !== null && (
                    <Pressable style={styles.locationClearBtn} onPress={handleClearLocation}
                      accessibilityRole="button" accessibilityLabel="Clear location">
                      <Text style={styles.locationClearBtnText}>Clear</Text>
                    </Pressable>
                  )}
                </View>
                <View style={styles.formActions}>
                  <Pressable style={styles.cancelButton} onPress={handleCancelLocation}
                    accessibilityRole="button" accessibilityLabel="Cancel">
                    <Text style={styles.cancelButtonText}>{t('common_cancel')}</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    onPress={handleSaveLocation} disabled={isSaving}
                    accessibilityRole="button" accessibilityLabel="Save location">
                    <Text style={styles.saveButtonText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.infoRowWithAction}>
                <View style={{ flex: 1 }}>
                  <InfoRow
                    label="GPS"
                    value={restaurant?.latitude != null
                      ? `${restaurant.latitude.toFixed(5)}, ${restaurant.longitude?.toFixed(5)}`
                      : '—'}
                  />
                </View>
                {restaurant !== null && (
                  <Pressable style={styles.inlineEditBtn} onPress={handleEditLocation}
                    accessibilityRole="button" accessibilityLabel="Edit GPS location">
                    <Ionicons name="pencil-outline" size={13} color={colours.primary} />
                  </Pressable>
                )}
              </View>
            )}
            <View style={styles.divider} />

            {/* Phone — editable */}
            {isEditingPhone ? (
              <View>
                <Text style={styles.inputLabel}>{t('restaurant_phone_label')}</Text>
                <TextInput
                  style={styles.input}
                  value={phoneInput}
                  onChangeText={handlePhoneChange}
                  placeholder="+66 xx xxx xxxx"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="phone-pad"
                  accessibilityLabel="Phone number"
                />
                <View style={styles.formActions}>
                  <Pressable style={styles.cancelButton} onPress={handleCancelPhone} accessibilityRole="button" accessibilityLabel="Cancel">
                    <Text style={styles.cancelButtonText}>{t('common_cancel')}</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSavePhone} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save phone">
                    <Text style={styles.saveButtonText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.infoRowWithAction}>
                <View style={{ flex: 1 }}>
                  <InfoRow label={t('restaurant_phone_label')} value={restaurant?.phone ?? '—'} />
                </View>
                {restaurant !== null && (
                  <Pressable style={styles.inlineEditBtn} onPress={handleEditPhone} accessibilityRole="button" accessibilityLabel="Edit phone">
                    <Ionicons name="pencil-outline" size={13} color={colours.primary} />
                  </Pressable>
                )}
              </View>
            )}
            <View style={styles.divider} />

            {/* Description — editable */}
            {isEditing ? (
              <View>
                <Text style={styles.inputLabel}>{t('restaurant_description_label')}</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={descriptionForm.description}
                  onChangeText={handleDescriptionChange}
                  placeholder={t('restaurant_description_placeholder')}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                  numberOfLines={3}
                  accessibilityLabel="Restaurant description"
                />
                <View style={styles.formActions}>
                  <Pressable style={styles.cancelButton} onPress={handleCancelEdit} accessibilityRole="button" accessibilityLabel="Cancel">
                    <Text style={styles.cancelButtonText}>{t('common_cancel')}</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save description">
                    <Text style={styles.saveButtonText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <InfoRow label={t('restaurant_description_label')} value={restaurant?.description ?? '—'} />
            )}

          </View>

          {/* KYC resubmit note */}
          {restaurant !== null && (
            <View style={styles.kycNote}>
              <Text style={styles.kycNoteText}>
                {t('restaurant_kyc_note')}{' '}
              </Text>
              <Pressable onPress={handleOpenResubmit} accessibilityRole="button" accessibilityLabel="Request name or address change">
                <Text style={styles.kycNoteLink}>{t('restaurant_request_change')}</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Stock System card — own card so overflow:hidden on Profile card can't clip the Switch */}
        {restaurant !== null && (
          <View style={styles.stockCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Stock Management</Text>
            </View>
            <View style={styles.stockCardBody}>
              <View style={styles.stockToggleInfo}>
                <Ionicons name="cube-outline" size={16} color={colours.primary} />
                <View style={styles.stockToggleLabels}>
                  <Text style={styles.stockToggleSubtitle}>
                    {restaurant.use_stock_system
                      ? 'Tracking stock per item — customers see remaining quantities'
                      : 'Off — items use Available / Sold Out / Hidden status'}
                  </Text>
                </View>
              </View>
              <Switch
                value={restaurant.use_stock_system}
                onValueChange={handleToggleStockSystem}
                trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                thumbColor={restaurant.use_stock_system ? colours.primary : colours.medium}
                accessibilityLabel="Toggle stock management system"
              />
            </View>
          </View>
        )}

        {/* Opening Hours — managed in Settings > Operating Hours; hidden here for now */}
        {/* {restaurant != null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('restaurant_opening_hours_card')}</Text>
              {!isEditingHours && (
                <Pressable style={styles.editDeliveryBtn} onPress={handleEditHours} accessibilityRole="button" accessibilityLabel="Edit opening hours">
                  <Ionicons name="pencil-outline" size={12} color={colours.primary} />
                  <Text style={styles.editDeliveryBtnText}>{t('common_edit')}</Text>
                </Pressable>
              )}
            </View>
            {isEditingHours ? (
              <View>
                <View style={styles.hoursHeader}>
                  <Text style={[styles.hoursCell, styles.hoursDayCell]}>{t('restaurant_day_col')}</Text>
                  <Text style={[styles.hoursCell, styles.hoursTimeCell]}>{t('restaurant_opens_col')}</Text>
                  <Text style={[styles.hoursCell, styles.hoursTimeCell]}>{t('restaurant_closes_col')}</Text>
                  <Text style={[styles.hoursCell, styles.hoursStatusCell]}>{t('restaurant_open_col')}</Text>
                </View>
                {openingHoursInput.map((h) => (
                  <View key={h.day_of_week} style={styles.hoursRow}>
                    <Text style={[styles.hoursCell, styles.hoursDayCell]}>{DAY_SHORT[h.day_of_week]}</Text>
                    <TextInput
                      style={[styles.hoursCell, styles.hoursTimeCell, styles.hoursInput, h.is_closed && styles.hoursInputDisabled]}
                      value={h.opens_at ?? ''}
                      onChangeText={(v) => handleHourChange(h.day_of_week, 'opens_at', v)}
                      placeholder="09:00"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      editable={!h.is_closed}
                      accessibilityLabel={`Opening time for ${DAY_SHORT[h.day_of_week]}`}
                    />
                    <TextInput
                      style={[styles.hoursCell, styles.hoursTimeCell, styles.hoursInput, h.is_closed && styles.hoursInputDisabled]}
                      value={h.closes_at ?? ''}
                      onChangeText={(v) => handleHourChange(h.day_of_week, 'closes_at', v)}
                      placeholder="22:00"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      editable={!h.is_closed}
                      accessibilityLabel={`Closing time for ${DAY_SHORT[h.day_of_week]}`}
                    />
                    <View style={[styles.hoursStatusCell, { alignItems: 'center' }]}>
                      <Switch
                        value={!h.is_closed}
                        onValueChange={(v: boolean) => handleHourToggle(h.day_of_week, !v)}
                        trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                        thumbColor={!h.is_closed ? colours.primary : colours.medium}
                        accessibilityLabel={`Toggle open for ${DAY_SHORT[h.day_of_week]}`}
                      />
                    </View>
                  </View>
                ))}
                {hoursError !== null && (
                  <Pressable onPress={handleClearHoursError} accessibilityRole="button" accessibilityLabel="Dismiss error">
                    <Text style={{ color: colours.error, fontSize: 13, marginTop: 8, marginBottom: 4 }}>{hoursError}</Text>
                  </Pressable>
                )}
                <View style={[styles.formActions, { marginTop: 12 }]}>
                  <Pressable style={styles.cancelButton} onPress={handleCancelHours} accessibilityRole="button" accessibilityLabel="Cancel">
                    <Text style={styles.cancelButtonText}>{t('common_cancel')}</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSaveHours} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save hours">
                    <Text style={styles.saveButtonText}>{isSaving ? t('common_saving') : t('restaurant_save_hours')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.cardBody}>
                {restaurant.opening_hours?.length ? (
                  restaurant.opening_hours.map((h) => (
                    <View key={h.day_of_week} style={styles.hoursReadRow}>
                      <Text style={styles.hoursDayLabel}>{DAY_SHORT[h.day_of_week]}</Text>
                      {h.is_closed ? (
                        <Text style={styles.hoursClosed}>{t('restaurant_closed_label')}</Text>
                      ) : (
                        <Text style={styles.hoursTime}>{h.opens_at} – {h.closes_at}</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.infoValue}>{t('restaurant_not_set')}</Text>
                )}
              </View>
            )}
          </View>
        )} */}

        {/* Min Order */}
        {restaurant != null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('restaurant_min_order_card')}</Text>
              {!isEditingDelivery && (
                <Pressable style={styles.editDeliveryBtn} onPress={handleEditDelivery} accessibilityRole="button" accessibilityLabel="Edit minimum order amount">
                  <Ionicons name="pencil-outline" size={12} color={colours.primary} />
                  <Text style={styles.editDeliveryBtnText}>{t('common_edit')}</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.cardBody}>
              {isEditingDelivery ? (
                <View style={styles.deliveryEditRow}>
                  <View style={styles.deliveryEditInputWrap}>
                    <TextInput
                      style={styles.deliveryEditInput}
                      value={minOrderInput}
                      onChangeText={handleMinOrderChange}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      accessibilityLabel="Minimum order amount"
                    />
                    <Text style={styles.deliveryEditCurrency}>฿</Text>
                  </View>
                  <View style={styles.deliveryEditActions}>
                    <Pressable style={styles.deliveryEditCancel} onPress={handleCancelDelivery} accessibilityRole="button">
                      <Text style={styles.deliveryEditCancelText}>{t('common_cancel')}</Text>
                    </Pressable>
                    <Pressable style={[styles.deliveryEditSave, isSaving && styles.saveButtonDisabled]} onPress={handleSaveDelivery} disabled={isSaving} accessibilityRole="button">
                      <Text style={styles.deliveryEditSaveText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <InfoRow label={t('restaurant_min_order_card')} value={formatPrice(restaurant.min_order_cents)} />
              )}
            </View>
          </View>
        )}

        {/* Reviews shortcut */}
        {restaurant !== null && onReviewsPress !== undefined && (
          <Pressable style={styles.supportButton} onPress={onReviewsPress}
            accessibilityRole="button" accessibilityLabel="View customer reviews">
            <Ionicons name="star-outline" size={18} color={colours.primary} />
            <Text style={styles.supportButtonText}>{t('restaurant_customer_reviews')}</Text>
          </Pressable>
        )}

        {/* Contact support */}
        <Pressable style={styles.supportButton} onPress={handleContactSupport}
          accessibilityRole="button" accessibilityLabel="Contact MOi Order support on LINE">
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={colours.primary} />
          <Text style={styles.supportButtonText}>{t('restaurant_contact_support')}</Text>
        </Pressable>
      </ScrollView>

      {/* Cover photo crop modal */}
      {coverCropSource !== null && (
        <CoverPhotoCropModal
          uri={coverCropSource.uri}
          imageWidth={coverCropSource.width}
          imageHeight={coverCropSource.height}
          onCrop={handleCoverCropDone}
          onCancel={handleCoverCropCancel}
        />
      )}

      {/* KYC Resubmit Modal */}
      <Modal visible={resubmitModal} animationType="slide" transparent onRequestClose={handleCloseResubmit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {resubmitForm.step === 'done' ? t('restaurant_request_submitted') : t('restaurant_change_name_address')}
              </Text>
              <Pressable onPress={handleCloseResubmit} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={colours.textOnDark} />
              </Pressable>
            </View>

            {resubmitForm.step === 'form' && (
              <View style={styles.modalBody}>
                <Text style={styles.modalNote}>{t('restaurant_modal_form_note')}</Text>
                <Text style={styles.inputLabel}>{t('restaurant_new_name_label')}</Text>
                <TextInput
                  style={styles.input}
                  value={resubmitForm.business_name}
                  onChangeText={(v) => handleResubmitFieldChange('business_name', v)}
                  placeholder={t('restaurant_name_label')}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  accessibilityLabel="New restaurant name"
                />
                <Text style={styles.inputLabel}>{t('restaurant_new_address_label')}</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={resubmitForm.business_address}
                  onChangeText={(v) => handleResubmitFieldChange('business_address', v)}
                  placeholder={t('restaurant_address_label')}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                  accessibilityLabel="New address"
                />
                <Pressable
                  style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                  onPress={handleResubmitSubmitForm}
                  disabled={isSaving}
                  accessibilityRole="button"
                  accessibilityLabel="Next"
                >
                  <Text style={styles.saveButtonText}>{isSaving ? t('restaurant_creating') : t('restaurant_next_upload_docs')}</Text>
                </Pressable>
              </View>
            )}

            {resubmitForm.step === 'docs' && (
              <ScrollView style={{ maxHeight: 480 }} contentContainerStyle={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalNote}>{t('restaurant_modal_docs_note')}</Text>

                {/* Use existing docs shortcut */}
                <Pressable
                  style={styles.useExistingBtn}
                  onPress={handleUseExistingDocs}
                  disabled={isUsingExistingDocs}
                  accessibilityRole="button"
                  accessibilityLabel="Use same documents as original KYC"
                >
                  {isUsingExistingDocs
                    ? <ActivityIndicator size="small" color={colours.primary} />
                    : <Ionicons name="copy-outline" size={16} color={colours.primary} />
                  }
                  <Text style={styles.useExistingBtnText}>
                    {isUsingExistingDocs ? t('restaurant_copying') : t('restaurant_use_same_docs')}
                  </Text>
                </Pressable>

                {/* OR divider */}
                <View style={styles.orDivider}>
                  <View style={styles.orDividerLine} />
                  <Text style={styles.orDividerText}>{t('restaurant_or_upload_new')}</Text>
                  <View style={styles.orDividerLine} />
                </View>

                {/* Individual doc upload rows */}
                <View>
                  {RESUBMIT_DOC_TYPES.map(({ type, label }) => {
                    const uploaded = resubmitForm.uploadedDocTypes.includes(type);
                    return (
                      <View key={type} style={styles.docUploadRow}>
                        <Ionicons
                          name={uploaded ? 'checkmark-circle' : 'ellipse-outline'}
                          size={18}
                          color={uploaded ? colours.success : colours.textSubtle}
                        />
                        <Text style={styles.docUploadRowLabel}>{label}</Text>
                        {uploaded && <Text style={styles.docUploadRowUploaded}>{t('restaurant_doc_ready')}</Text>}
                        <Pressable
                          style={styles.docUploadRowBtn}
                          onPress={() => { void handlePickResubmitDoc(type); }}
                          accessibilityRole="button"
                          accessibilityLabel={`${uploaded ? 'Replace' : 'Upload'} ${label}`}
                        >
                          <Text style={styles.docUploadRowBtnText}>{uploaded ? t('common_replace') : t('common_upload')}</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>

                {/* Progress + submit */}
                <View style={styles.docUploadProgress}>
                  <Text style={styles.docUploadProgressText}>
                    {resubmitForm.uploadedDocTypes.length}/{RESUBMIT_DOC_TYPES.length} documents ready
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.saveButton,
                    (isSaving || resubmitForm.uploadedDocTypes.length < RESUBMIT_DOC_TYPES.length) && styles.saveButtonDisabled,
                  ]}
                  onPress={handleResubmitFinalSubmit}
                  disabled={isSaving || resubmitForm.uploadedDocTypes.length < RESUBMIT_DOC_TYPES.length}
                  accessibilityRole="button"
                  accessibilityLabel="Submit resubmission"
                >
                  <Text style={styles.saveButtonText}>{isSaving ? t('restaurant_submitting') : t('restaurant_submit_review')}</Text>
                </Pressable>
              </ScrollView>
            )}

            {resubmitForm.step === 'done' && (
              <View style={styles.modalBody}>
                <Ionicons name="checkmark-circle" size={48} color={colours.success} style={{ alignSelf: 'center', marginBottom: 12 }} />
                <Text style={[styles.modalNote, { textAlign: 'center' }]}>
                  {t('restaurant_submitted_note')}
                </Text>
                <Pressable style={styles.saveButton} onPress={handleCloseResubmit} accessibilityRole="button" accessibilityLabel="Close">
                  <Text style={styles.saveButtonText}>{t('common_done')}</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
