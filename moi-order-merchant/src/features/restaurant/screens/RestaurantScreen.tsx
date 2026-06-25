import React from 'react';
import { View, Text, Pressable, ScrollView, Switch, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurantScreen } from '../hooks/useRestaurantScreen';
import { RestaurantHeroHeader } from '../components/RestaurantHeroHeader';
import { RestaurantPhotosCard } from '../components/RestaurantPhotosCard';
import { RestaurantProfileCard } from '../components/RestaurantProfileCard';
import { RestaurantResubmitModal } from '../components/RestaurantResubmitModal';
import { CoverPhotoCropModal } from '../components/CoverPhotoCropModal';
import { styles } from './RestaurantScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface RestaurantScreenProps {
  onReviewsPress?: () => void;
}

export function RestaurantScreen({ onReviewsPress }: RestaurantScreenProps): React.JSX.Element {
  const t = useTranslation();
  const {
    restaurant, isLoading, isEditing, isSaving, isNewRestaurant,
    isUploadingCover, isUploadingLogo, isUploadingGalleryPhoto,
    isEditingDelivery, isEditingPhone, minOrderInput, phoneInput, descriptionForm,
    resubmitModal, resubmitForm, isTogglingStatus, overrideActive, overrideUntil,
    statusWarning, isUsingExistingDocs,
    handleStartEdit, handleCancelEdit, handleDescriptionChange, handleSave,
    handleToggleStatus, handleDismissStatusWarning,
    handleUploadCoverPhoto, handleRemoveCoverPhoto, handleUploadLogo, handleRemoveLogo,
    handleUploadGalleryPhoto, handleRemoveGalleryPhoto, handleMoveGalleryPhoto,
    handleEditDelivery, handleCancelDelivery, handleMinOrderChange, handleSaveDelivery,
    handleEditPhone, handleCancelPhone, handlePhoneChange, handleSavePhone,
    isEditingLocation, locationInput, isLocating, locationError,
    handleEditLocation, handleCancelLocation, handleGetLocation, handleClearLocation, handleSaveLocation,
    handleOpenResubmit, handleCloseResubmit, handleResubmitFieldChange,
    handleResubmitSubmitForm, handleResubmitUploadDoc, handleResubmitFinalSubmit,
    handleUseExistingDocs, handleToggleStockSystem,
    coverCropSource, handlePickCoverPhoto, handleCoverCropDone, handleCoverCropCancel,
    handlePickLogo, handlePickGalleryPhoto, handlePickResubmitDoc, handleContactSupport,
  } = useRestaurantScreen();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{isNewRestaurant ? t('restaurant_setup_title') : t('restaurant_title')}</Text>
        </View>

        {restaurant !== null && (
          <RestaurantHeroHeader restaurant={restaurant} isTogglingStatus={isTogglingStatus} overrideActive={overrideActive} overrideUntil={overrideUntil} statusWarning={statusWarning} onToggleStatus={handleToggleStatus} onDismissWarning={handleDismissStatusWarning} onPickCoverPhoto={handlePickCoverPhoto} isUploadingCover={isUploadingCover} />
        )}

        {restaurant !== null && (
          <RestaurantPhotosCard restaurant={restaurant} isUploadingCover={isUploadingCover} isUploadingLogo={isUploadingLogo} isUploadingGalleryPhoto={isUploadingGalleryPhoto} onPickCoverPhoto={handlePickCoverPhoto} onRemoveCoverPhoto={handleRemoveCoverPhoto} onPickLogo={handlePickLogo} onRemoveLogo={handleRemoveLogo} onPickGalleryPhoto={handlePickGalleryPhoto} onRemoveGalleryPhoto={handleRemoveGalleryPhoto} onMoveGalleryPhoto={handleMoveGalleryPhoto} />
        )}

        <RestaurantProfileCard restaurant={restaurant} isEditing={isEditing} isSaving={isSaving} descriptionForm={descriptionForm} onStartEdit={handleStartEdit} onCancelEdit={handleCancelEdit} onDescriptionChange={handleDescriptionChange} onSave={handleSave} isEditingPhone={isEditingPhone} phoneInput={phoneInput} onEditPhone={handleEditPhone} onCancelPhone={handleCancelPhone} onPhoneChange={handlePhoneChange} onSavePhone={handleSavePhone} isEditingLocation={isEditingLocation} locationInput={locationInput} isLocating={isLocating} locationError={locationError} onEditLocation={handleEditLocation} onCancelLocation={handleCancelLocation} onGetLocation={handleGetLocation} onClearLocation={handleClearLocation} onSaveLocation={handleSaveLocation} onOpenResubmit={handleOpenResubmit} />

        {restaurant !== null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}><Text style={styles.cardTitle}>Stock Management</Text></View>
            <View style={styles.switchRow}>
              <Ionicons name="cube-outline" size={16} color={colours.primary} />
              <Text style={styles.switchLabel}>{restaurant.use_stock_system ? 'Tracking stock per item — customers see quantities' : 'Off — items use Available / Sold Out / Hidden status'}</Text>
              <Switch value={restaurant.use_stock_system} onValueChange={handleToggleStockSystem} trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }} thumbColor={restaurant.use_stock_system ? colours.primary : colours.medium} accessibilityLabel="Toggle stock management" />
            </View>
          </View>
        )}

        {restaurant !== null && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('restaurant_min_order_card')}</Text>
              {!isEditingDelivery && <Pressable style={styles.editInlineBtn} onPress={handleEditDelivery} accessibilityRole="button" accessibilityLabel="Edit minimum order"><Ionicons name="pencil-outline" size={12} color={colours.primaryDark} /><Text style={styles.editInlineBtnText}>{t('common_edit')}</Text></Pressable>}
            </View>
            <View style={styles.cardBody}>
              {isEditingDelivery ? (
                <View style={styles.minOrderEdit}>
                  <View style={styles.minOrderInputWrap}><TextInput style={styles.minOrderInput} value={minOrderInput} onChangeText={handleMinOrderChange} keyboardType="number-pad" placeholder="0" placeholderTextColor={colours.textSubtle} accessibilityLabel="Minimum order amount" /><Text style={styles.minOrderCurrency}>฿</Text></View>
                  <View style={styles.minOrderActions}><Pressable style={styles.cancelBtn} onPress={handleCancelDelivery} accessibilityRole="button"><Text style={styles.cancelBtnText}>{t('common_cancel')}</Text></Pressable><Pressable style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={handleSaveDelivery} disabled={isSaving} accessibilityRole="button"><Text style={styles.saveBtnText}>{isSaving ? t('common_saving') : t('common_save')}</Text></Pressable></View>
                </View>
              ) : (
                <View style={styles.infoRow}><Text style={styles.infoLabel}>{t('restaurant_min_order_card')}</Text><Text style={styles.infoValue}>{formatPrice(restaurant.min_order_cents)}</Text></View>
              )}
            </View>
          </View>
        )}

        {restaurant !== null && onReviewsPress !== undefined && (
          <Pressable style={styles.actionBtn} onPress={onReviewsPress} accessibilityRole="button" accessibilityLabel="View customer reviews">
            <Ionicons name="star-outline" size={17} color={colours.primary} />
            <Text style={styles.actionBtnText}>{t('restaurant_customer_reviews')}</Text>
          </Pressable>
        )}

        <Pressable style={styles.actionBtn} onPress={handleContactSupport} accessibilityRole="button" accessibilityLabel="Contact support on LINE">
          <Ionicons name="chatbubble-ellipses-outline" size={17} color={colours.primary} />
          <Text style={styles.actionBtnText}>{t('restaurant_contact_support')}</Text>
        </Pressable>
      </ScrollView>

      {coverCropSource !== null && (
        <CoverPhotoCropModal uri={coverCropSource.uri} imageWidth={coverCropSource.width} imageHeight={coverCropSource.height} onCrop={handleCoverCropDone} onCancel={handleCoverCropCancel} />
      )}

      <RestaurantResubmitModal visible={resubmitModal} resubmitForm={resubmitForm} isSaving={isSaving} isUsingExistingDocs={isUsingExistingDocs} onClose={handleCloseResubmit} onFieldChange={handleResubmitFieldChange} onSubmitForm={handleResubmitSubmitForm} onPickDoc={handlePickResubmitDoc} onUseExistingDocs={handleUseExistingDocs} onFinalSubmit={handleResubmitFinalSubmit} />
    </SafeAreaView>
  );
}
