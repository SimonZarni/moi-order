import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, ActivityIndicator,
  Image, Linking, Switch, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRestaurantScreen } from '../hooks/useRestaurantScreen';
import { CoverPhotoCropModal } from '../components/CoverPhotoCropModal';
import { styles } from './RestaurantScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { RESTAURANT_STATUS } from '../../../types/enums';
import type { RestaurantStatus } from '../../../types/enums';
import { MAX_GALLERY_PHOTOS } from '../../../shared/constants/config';

const LINE_OA_URL = 'https://line.me/R/ti/p/%40moiorder';

const STATUS_CONFIG: Record<RestaurantStatus, { label: string; color: string; bg: string }> = {
  [RESTAURANT_STATUS.Open]:   { label: '🟢 Open',   color: colours.success,  bg: colours.successBg },
  [RESTAURANT_STATUS.Closed]: { label: '🔴 Closed', color: colours.error,    bg: colours.errorBg },
  [RESTAURANT_STATUS.Paused]: { label: '🟡 Paused', color: colours.warning,  bg: colours.warningBg },
};

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface RestaurantScreenProps {
  onReviewsPress?: () => void;
}

export function RestaurantScreen({ onReviewsPress }: RestaurantScreenProps): React.JSX.Element {
  const {
    restaurant, isLoading, isEditing, isSaving, isNewRestaurant,
    isUploadingCover, isUploadingLogo, isUploadingGalleryPhoto,
    isEditingDelivery, isEditingPhone, isEditingHours,
    minOrderInput, phoneInput, openingHoursInput, descriptionForm,
    resubmitModal, resubmitForm,
    handleStartEdit, handleCancelEdit, handleDescriptionChange, handleSave,
    handleToggleStatus,
    handleUploadCoverPhoto, handleRemoveCoverPhoto,
    handleUploadLogo, handleRemoveLogo,
    handleUploadGalleryPhoto, handleRemoveGalleryPhoto, handleMoveGalleryPhoto,
    handleEditDelivery, handleCancelDelivery, handleMinOrderChange, handleSaveDelivery,
    handleToggleDelivery, handleTogglePickup,
    handleEditPhone, handleCancelPhone, handlePhoneChange, handleSavePhone,
    handleEditHours, handleCancelHours, handleClearHoursError, handleHourChange, handleHourToggle, handleSaveHours,
    hoursError,
    handleOpenResubmit, handleCloseResubmit,
    handleResubmitFieldChange, handleResubmitSubmitForm,
    handleResubmitFinalSubmit,
    statusWarning, handleDismissStatusWarning,
  } = useRestaurantScreen();

  const pickAndConvert = useCallback(async (
    onPick: (uri: string, name: string, type: string) => void,
    baseName: string,
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    let mimeType = asset.mimeType ?? 'image/jpeg';
    let uri = asset.uri;
    let fileName = asset.fileName ?? `${baseName}.${mimeType.split('/')[1] ?? 'jpg'}`;
    if (Platform.OS === 'web' && (mimeType === 'image/heic' || mimeType === 'image/heif')) {
      try {
        const heic2any = (await import('heic2any')).default;
        const srcBlob = await fetch(uri).then((r) => r.blob());
        const converted = await heic2any({ blob: srcBlob, toType: 'image/jpeg', quality: 0.85 });
        const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
        uri = URL.createObjectURL(jpegBlob);
        mimeType = 'image/jpeg';
        fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
      } catch { /* fall through with original file */ }
    }
    onPick(uri, fileName, mimeType);
  }, []);

  const [coverCropSource, setCoverCropSource] = useState<{
    uri: string; name: string; type: string; width: number; height: number;
  } | null>(null);

  const handlePickCoverPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 1 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    let uri = asset.uri;
    let mimeType = asset.mimeType ?? 'image/jpeg';
    let fileName = asset.fileName ?? `cover.${mimeType.split('/')[1] ?? 'jpg'}`;
    if (Platform.OS === 'web' && (mimeType === 'image/heic' || mimeType === 'image/heif')) {
      try {
        const heic2any = (await import('heic2any')).default;
        const srcBlob = await fetch(uri).then((r) => r.blob());
        const converted = await heic2any({ blob: srcBlob, toType: 'image/jpeg', quality: 0.85 });
        const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
        uri = URL.createObjectURL(jpegBlob);
        mimeType = 'image/jpeg';
        fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
      } catch { /* fall through with original */ }
    }
    setCoverCropSource({ uri, name: fileName, type: mimeType, width: asset.width ?? 1200, height: asset.height ?? 675 });
  }, []);

  const handleCoverCropDone = useCallback((croppedUri: string) => {
    if (coverCropSource === null) return;
    const croppedName = coverCropSource.name.replace(/\.[^.]+$/, '.jpg');
    handleUploadCoverPhoto(croppedUri, croppedName, 'image/jpeg');
    setCoverCropSource(null);
  }, [coverCropSource, handleUploadCoverPhoto]);

  const handleCoverCropCancel = useCallback(() => setCoverCropSource(null), []);

  const handlePickLogo = useCallback(async () => {
    await pickAndConvert(handleUploadLogo, 'logo');
  }, [pickAndConvert, handleUploadLogo]);

  const handlePickGalleryPhoto = useCallback(async () => {
    await pickAndConvert(handleUploadGalleryPhoto, 'gallery');
  }, [pickAndConvert, handleUploadGalleryPhoto]);

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
          <Text style={styles.headerTitle}>{isNewRestaurant ? 'Setup Restaurant' : 'Restaurant'}</Text>
          {!isEditing && restaurant !== null && (
            <Pressable style={styles.editButton} onPress={handleStartEdit}
              accessibilityLabel="Edit description" accessibilityRole="button">
              <Ionicons name="pencil-outline" size={14} color={colours.backgroundDark} />
              <Text style={styles.editButtonText}>Edit Description</Text>
            </Pressable>
          )}
        </View>

        {/* Status */}
        {restaurant !== null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Status</Text>
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
                    style={[styles.statusChip, isActive && [styles.statusChipActive, { backgroundColor: cfg.bg }]]}
                    onPress={() => handleToggleStatus(s)}
                    accessibilityLabel={`Set status to ${s}`} accessibilityRole="button">
                    <Text style={[styles.statusChipText, isActive && { color: cfg.color }]}>{cfg.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Photos */}
        {restaurant !== null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}><Text style={styles.cardTitle}>Photos</Text></View>
            <View style={styles.cardBody}>
              <Text style={styles.infoLabel}>Cover Photo</Text>
              {restaurant.cover_photo_url != null ? (
                <View style={styles.photoRow}>
                  <Image source={{ uri: restaurant.cover_photo_url }} style={styles.photoPreview} resizeMode="cover" />
                  <View style={styles.photoActions}>
                    <Pressable style={styles.photoBtn} onPress={handlePickCoverPhoto} disabled={isUploadingCover}
                      accessibilityRole="button" accessibilityLabel="Change cover photo">
                      {isUploadingCover ? <ActivityIndicator size="small" color={colours.primary} /> : <Text style={styles.photoBtnText}>Change</Text>}
                    </Pressable>
                    <Pressable style={[styles.photoBtn, styles.photoBtnDanger]} onPress={handleRemoveCoverPhoto}
                      accessibilityRole="button" accessibilityLabel="Remove cover photo">
                      <Text style={[styles.photoBtnText, { color: colours.error }]}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={styles.photoUploadBtn} onPress={handlePickCoverPhoto} disabled={isUploadingCover}
                  accessibilityRole="button" accessibilityLabel="Upload cover photo">
                  {isUploadingCover ? <ActivityIndicator size="small" color={colours.primary} /> : (
                    <><Ionicons name="image-outline" size={18} color={colours.primary} /><Text style={styles.photoBtnText}>Upload Cover Photo</Text></>
                  )}
                </Pressable>
              )}
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>Logo</Text>
              {restaurant.logo_url != null ? (
                <View style={styles.photoRow}>
                  <Image source={{ uri: restaurant.logo_url }} style={styles.logoPreview} resizeMode="cover" />
                  <View style={styles.photoActions}>
                    <Pressable style={styles.photoBtn} onPress={handlePickLogo} disabled={isUploadingLogo}
                      accessibilityRole="button" accessibilityLabel="Change logo">
                      {isUploadingLogo ? <ActivityIndicator size="small" color={colours.primary} /> : <Text style={styles.photoBtnText}>Change</Text>}
                    </Pressable>
                    <Pressable style={[styles.photoBtn, styles.photoBtnDanger]} onPress={handleRemoveLogo}
                      accessibilityRole="button" accessibilityLabel="Remove logo">
                      <Text style={[styles.photoBtnText, { color: colours.error }]}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={styles.photoUploadBtn} onPress={handlePickLogo} disabled={isUploadingLogo}
                  accessibilityRole="button" accessibilityLabel="Upload logo">
                  {isUploadingLogo ? <ActivityIndicator size="small" color={colours.primary} /> : (
                    <><Ionicons name="image-outline" size={18} color={colours.primary} /><Text style={styles.photoBtnText}>Upload Logo</Text></>
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
                    <><Ionicons name="image-outline" size={18} color={colours.primary} /><Text style={styles.photoBtnText}>Add Gallery Photo</Text></>
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
          <View style={styles.cardHeader}><Text style={styles.cardTitle}>Profile</Text></View>
          <View style={styles.cardBody}>

            {/* Name — read-only, locked by KYC */}
            <InfoRow label="Name" value={restaurant?.name ?? '—'} />
            <View style={styles.divider} />

            {/* Address — read-only, locked by KYC */}
            <InfoRow label="Address" value={restaurant?.address ?? '—'} />
            <View style={styles.divider} />

            {/* Phone — editable */}
            {isEditingPhone ? (
              <View>
                <Text style={styles.inputLabel}>Phone</Text>
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
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSavePhone} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save phone">
                    <Text style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save'}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.infoRowWithAction}>
                <View style={{ flex: 1 }}>
                  <InfoRow label="Phone" value={restaurant?.phone ?? '—'} />
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
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={descriptionForm.description}
                  onChangeText={handleDescriptionChange}
                  placeholder="Tell customers about your restaurant"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                  numberOfLines={3}
                  accessibilityLabel="Restaurant description"
                />
                <View style={styles.formActions}>
                  <Pressable style={styles.cancelButton} onPress={handleCancelEdit} accessibilityRole="button" accessibilityLabel="Cancel">
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save description">
                    <Text style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save'}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <InfoRow label="Description" value={restaurant?.description ?? '—'} />
            )}
          </View>

          {/* KYC resubmit note */}
          {restaurant !== null && (
            <View style={styles.kycNote}>
              <Text style={styles.kycNoteText}>
                Name and address can only be changed via KYC resubmission.{' '}
              </Text>
              <Pressable onPress={handleOpenResubmit} accessibilityRole="button" accessibilityLabel="Request name or address change">
                <Text style={styles.kycNoteLink}>Request change →</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Opening Hours */}
        {restaurant != null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Opening Hours</Text>
              {!isEditingHours && (
                <Pressable style={styles.editDeliveryBtn} onPress={handleEditHours} accessibilityRole="button" accessibilityLabel="Edit opening hours">
                  <Ionicons name="pencil-outline" size={12} color={colours.primary} />
                  <Text style={styles.editDeliveryBtnText}>Edit</Text>
                </Pressable>
              )}
            </View>
            {isEditingHours ? (
              <View>
                <View style={styles.hoursHeader}>
                  <Text style={[styles.hoursCell, styles.hoursDayCell]}>Day</Text>
                  <Text style={[styles.hoursCell, styles.hoursTimeCell]}>Opens</Text>
                  <Text style={[styles.hoursCell, styles.hoursTimeCell]}>Closes</Text>
                  <Text style={[styles.hoursCell, styles.hoursStatusCell]}>Open</Text>
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
                        onValueChange={(v) => handleHourToggle(h.day_of_week, !v)}
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
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSaveHours} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save hours">
                    <Text style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save Hours'}</Text>
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
                        <Text style={styles.hoursClosed}>Closed</Text>
                      ) : (
                        <Text style={styles.hoursTime}>{h.opens_at} – {h.closes_at}</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.infoValue}>Not set</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Delivery & Pickup */}
        {restaurant != null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Delivery & Pickup</Text>
              {!isEditingDelivery && (
                <Pressable style={styles.editDeliveryBtn} onPress={handleEditDelivery} accessibilityRole="button" accessibilityLabel="Edit min order">
                  <Ionicons name="pencil-outline" size={12} color={colours.primary} />
                  <Text style={styles.editDeliveryBtnText}>Edit</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Delivery</Text>
                <Switch
                  value={restaurant.is_delivery_available}
                  onValueChange={handleToggleDelivery}
                  trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                  thumbColor={restaurant.is_delivery_available ? colours.primary : colours.medium}
                  accessibilityLabel="Toggle delivery"
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Pickup</Text>
                <Switch
                  value={restaurant.is_pickup_available}
                  onValueChange={handleTogglePickup}
                  trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                  thumbColor={restaurant.is_pickup_available ? colours.primary : colours.medium}
                  accessibilityLabel="Toggle pickup"
                />
              </View>
              <View style={styles.divider} />
              {isEditingDelivery ? (
                <View style={styles.deliveryEditRow}>
                  <Text style={styles.infoLabel}>Min Order</Text>
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
                      <Text style={styles.deliveryEditCancelText}>Cancel</Text>
                    </Pressable>
                    <Pressable style={[styles.deliveryEditSave, isSaving && styles.saveButtonDisabled]} onPress={handleSaveDelivery} disabled={isSaving} accessibilityRole="button">
                      <Text style={styles.deliveryEditSaveText}>{isSaving ? 'Saving…' : 'Save'}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <InfoRow label="Min Order" value={formatPrice(restaurant.min_order_cents)} />
              )}
            </View>
          </View>
        )}

        {/* Reviews shortcut */}
        {restaurant !== null && onReviewsPress !== undefined && (
          <Pressable style={styles.supportButton} onPress={onReviewsPress}
            accessibilityRole="button" accessibilityLabel="View customer reviews">
            <Ionicons name="star-outline" size={18} color={colours.primary} />
            <Text style={styles.supportButtonText}>Customer Reviews</Text>
          </Pressable>
        )}

        {/* Contact support */}
        <Pressable style={styles.supportButton} onPress={handleContactSupport}
          accessibilityRole="button" accessibilityLabel="Contact Moi Order support on LINE">
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={colours.primary} />
          <Text style={styles.supportButtonText}>Contact Support (LINE)</Text>
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
                {resubmitForm.step === 'done' ? 'Request Submitted' : 'Change Name / Address'}
              </Text>
              <Pressable onPress={handleCloseResubmit} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={colours.textOnDark} />
              </Pressable>
            </View>

            {resubmitForm.step === 'form' && (
              <View style={styles.modalBody}>
                <Text style={styles.modalNote}>
                  Enter your new restaurant name and address. An admin will verify and approve the change.
                </Text>
                <Text style={styles.inputLabel}>New Restaurant Name</Text>
                <TextInput
                  style={styles.input}
                  value={resubmitForm.business_name}
                  onChangeText={(v) => handleResubmitFieldChange('business_name', v)}
                  placeholder="Restaurant name"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  accessibilityLabel="New restaurant name"
                />
                <Text style={styles.inputLabel}>New Address</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={resubmitForm.business_address}
                  onChangeText={(v) => handleResubmitFieldChange('business_address', v)}
                  placeholder="Full business address"
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
                  <Text style={styles.saveButtonText}>{isSaving ? 'Creating…' : 'Next → Upload Documents'}</Text>
                </Pressable>
              </View>
            )}

            {resubmitForm.step === 'docs' && (
              <View style={styles.modalBody}>
                <Text style={styles.modalNote}>
                  Please upload your supporting documents (passport, business registration, proof of address) to verify the change.
                </Text>
                <Text style={styles.modalDocNote}>
                  Use the same document upload process as your original KYC. When ready, tap Submit.
                </Text>
                <Pressable
                  style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                  onPress={handleResubmitFinalSubmit}
                  disabled={isSaving}
                  accessibilityRole="button"
                  accessibilityLabel="Submit resubmission"
                >
                  <Text style={styles.saveButtonText}>{isSaving ? 'Submitting…' : 'Submit for Review'}</Text>
                </Pressable>
              </View>
            )}

            {resubmitForm.step === 'done' && (
              <View style={styles.modalBody}>
                <Ionicons name="checkmark-circle" size={48} color={colours.success} style={{ alignSelf: 'center', marginBottom: 12 }} />
                <Text style={[styles.modalNote, { textAlign: 'center' }]}>
                  Your request has been submitted. An admin will review and approve or reject the change. You will be notified of the outcome.
                </Text>
                <Pressable style={styles.saveButton} onPress={handleCloseResubmit} accessibilityRole="button" accessibilityLabel="Close">
                  <Text style={styles.saveButtonText}>Done</Text>
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
