import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Image, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRestaurantScreen } from '../hooks/useRestaurantScreen';
import { styles } from './RestaurantScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { RESTAURANT_STATUS } from '../../../types/enums';
import type { RestaurantStatus } from '../../../types/enums';

const LINE_OA_URL = 'https://line.me/R/ti/p/%40moiorder';

const STATUS_CONFIG: Record<RestaurantStatus, { label: string; color: string; bg: string }> = {
  [RESTAURANT_STATUS.Open]:   { label: '🟢 Open',   color: colours.success,  bg: colours.successBg },
  [RESTAURANT_STATUS.Closed]: { label: '🔴 Closed', color: colours.error,    bg: colours.errorBg },
  [RESTAURANT_STATUS.Paused]: { label: '🟡 Paused', color: colours.warning,  bg: colours.warningBg },
};

export function RestaurantScreen(): React.JSX.Element {
  const {
    restaurant, isLoading, isEditing, isSaving,
    isUploadingCover, isUploadingLogo,
    form, handleStartEdit, handleCancelEdit,
    handleFieldChange, handleSave, handleToggleStatus,
    handleUploadCoverPhoto, handleRemoveCoverPhoto,
    handleUploadLogo, handleRemoveLogo,
  } = useRestaurantScreen();

  const handlePickCoverPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    handleUploadCoverPhoto(asset.uri, `cover.${ext}`, `image/${ext}`);
  }, [handleUploadCoverPhoto]);

  const handlePickLogo = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    handleUploadLogo(asset.uri, `logo.${ext}`, `image/${ext}`);
  }, [handleUploadLogo]);

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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Restaurant</Text>
          {!isEditing && (
            <Pressable
              style={styles.editButton}
              onPress={handleStartEdit}
              accessibilityLabel="Edit restaurant profile"
              accessibilityRole="button"
            >
              <Ionicons name="pencil-outline" size={14} color={colours.white} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Status</Text>
          </View>
          <View style={styles.statusRow}>
            {(Object.values(RESTAURANT_STATUS) as RestaurantStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const isActive = currentStatus === s;
              return (
                <Pressable
                  key={s}
                  style={[
                    styles.statusChip,
                    isActive && [styles.statusChipActive, { backgroundColor: cfg.bg }],
                  ]}
                  onPress={() => handleToggleStatus(s)}
                  accessibilityLabel={`Set status to ${s}`}
                  accessibilityRole="button"
                >
                  <Text style={[styles.statusChipText, isActive && { color: cfg.color }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Photos card — always visible */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Photos</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.infoLabel}>Cover Photo</Text>
            {restaurant?.cover_photo_url !== null && restaurant?.cover_photo_url !== undefined ? (
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
                  <>
                    <Ionicons name="image-outline" size={18} color={colours.primary} />
                    <Text style={styles.photoBtnText}>Upload Cover Photo</Text>
                  </>
                )}
              </Pressable>
            )}

            <View style={styles.divider} />
            <Text style={styles.infoLabel}>Logo</Text>
            {restaurant?.logo_url !== null && restaurant?.logo_url !== undefined ? (
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
                  <>
                    <Ionicons name="image-outline" size={18} color={colours.primary} />
                    <Text style={styles.photoBtnText}>Upload Logo</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </View>

        {isEditing ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Edit Profile</Text>
            </View>
            <View style={styles.formBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Restaurant Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(v) => handleFieldChange('name', v)}
                  placeholder="Restaurant name"
                  placeholderTextColor={colours.medium}
                  accessibilityLabel="Restaurant name"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={form.description}
                  onChangeText={(v) => handleFieldChange('description', v)}
                  placeholder="Tell customers about your restaurant"
                  placeholderTextColor={colours.medium}
                  multiline
                  numberOfLines={3}
                  accessibilityLabel="Restaurant description"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={form.address}
                  onChangeText={(v) => handleFieldChange('address', v)}
                  placeholder="Restaurant address"
                  placeholderTextColor={colours.medium}
                  accessibilityLabel="Restaurant address"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={form.phone}
                  onChangeText={(v) => handleFieldChange('phone', v)}
                  placeholder="+66 xx xxx xxxx"
                  placeholderTextColor={colours.medium}
                  keyboardType="phone-pad"
                  accessibilityLabel="Restaurant phone number"
                />
              </View>
            </View>
            <View style={styles.formActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleCancelEdit}
                accessibilityLabel="Cancel editing"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
                accessibilityLabel="Save restaurant profile"
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Profile</Text>
            </View>
            <View style={styles.cardBody}>
              <InfoRow label="Name" value={restaurant?.name ?? '—'} />
              <View style={styles.divider} />
              <InfoRow label="Description" value={restaurant?.description ?? '—'} />
              <View style={styles.divider} />
              <InfoRow label="Address" value={restaurant?.address ?? '—'} />
              <View style={styles.divider} />
              <InfoRow label="Phone" value={restaurant?.phone ?? '—'} />
            </View>
          </View>
        )}

        {restaurant !== undefined && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Delivery Settings</Text>
            </View>
            <View style={styles.cardBody}>
              <InfoRow
                label="Delivery"
                value={restaurant.is_delivery_available ? '✓ Available' : '✗ Not available'}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Pickup"
                value={restaurant.is_pickup_available ? '✓ Available' : '✗ Not available'}
              />
              <View style={styles.divider} />
              <InfoRow
                label="Min Order"
                value={formatPrice(restaurant.min_order_cents)}
              />
              {restaurant.delivery_radius_km !== null && (
                <>
                  <View style={styles.divider} />
                  <InfoRow label="Radius" value={`${restaurant.delivery_radius_km} km`} />
                </>
              )}
            </View>
          </View>
        )}

        {/* Contact support */}
        <Pressable
          style={styles.supportButton}
          onPress={handleContactSupport}
          accessibilityRole="button"
          accessibilityLabel="Contact Moi Order support on LINE"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={colours.primary} />
          <Text style={styles.supportButtonText}>Contact Support (LINE)</Text>
        </Pressable>
      </ScrollView>
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
