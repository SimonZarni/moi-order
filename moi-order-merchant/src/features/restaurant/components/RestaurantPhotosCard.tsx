import React from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './RestaurantPhotosCard.styles';
import { colours } from '../../../shared/theme/colours';
import { MAX_GALLERY_PHOTOS } from '../../../shared/constants/config';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { Restaurant } from '../../../types/models';

interface RestaurantPhotosCardProps {
  restaurant: Restaurant;
  isUploadingCover: boolean;
  isUploadingLogo: boolean;
  isUploadingGalleryPhoto: boolean;
  onPickCoverPhoto: () => Promise<void>;
  onRemoveCoverPhoto: () => void;
  onPickLogo: () => Promise<void>;
  onRemoveLogo: () => void;
  onPickGalleryPhoto: () => Promise<void>;
  onRemoveGalleryPhoto: (id: number) => void;
  onMoveGalleryPhoto: (id: number, direction: 'up' | 'down') => void;
}

export function RestaurantPhotosCard({
  restaurant, isUploadingCover, isUploadingLogo, isUploadingGalleryPhoto,
  onPickCoverPhoto, onRemoveCoverPhoto, onPickLogo, onRemoveLogo,
  onPickGalleryPhoto, onRemoveGalleryPhoto, onMoveGalleryPhoto,
}: RestaurantPhotosCardProps): React.JSX.Element {
  const t = useTranslation();
  const sorted = [...restaurant.photos].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}><Text style={styles.cardTitle}>{t('restaurant_photos_card')}</Text></View>

      {/* Cover */}
      <PhotoSection label={t('restaurant_cover_photo')}>
        {restaurant.cover_photo_url != null ? (
          <View style={styles.photoRow}>
            <Image source={{ uri: restaurant.cover_photo_url }} style={styles.photoPreview} resizeMode="cover" />
            <View style={styles.photoActions}>
              <PhotoBtn label={t('common_change')} onPress={onPickCoverPhoto} isLoading={isUploadingCover} />
              <PhotoBtn label={t('common_remove')} onPress={onRemoveCoverPhoto} danger />
            </View>
          </View>
        ) : (
          <UploadBtn label={t('restaurant_upload_cover')} onPress={onPickCoverPhoto} isLoading={isUploadingCover} />
        )}
      </PhotoSection>

      <View style={styles.divider} />

      {/* Logo */}
      <PhotoSection label={t('restaurant_logo_label')}>
        {restaurant.logo_url != null ? (
          <View style={styles.photoRow}>
            <Image source={{ uri: restaurant.logo_url }} style={styles.logoPreview} resizeMode="cover" />
            <View style={styles.photoActions}>
              <PhotoBtn label={t('common_change')} onPress={onPickLogo} isLoading={isUploadingLogo} />
              <PhotoBtn label={t('common_remove')} onPress={onRemoveLogo} danger />
            </View>
          </View>
        ) : (
          <UploadBtn label={t('restaurant_upload_logo')} onPress={onPickLogo} isLoading={isUploadingLogo} />
        )}
      </PhotoSection>

      <View style={styles.divider} />

      {/* Gallery */}
      <PhotoSection label={`Gallery (${restaurant.photos.length}/${MAX_GALLERY_PHOTOS})`}>
        {sorted.length > 0 && (
          <View style={styles.galleryRow}>
            {sorted.map((photo, index) => (
              <View key={photo.id} style={styles.galleryItem}>
                <Image source={{ uri: photo.url }} style={styles.galleryPreview} resizeMode="cover" />
                <View style={styles.galleryActions}>
                  <Pressable style={styles.galleryBtn} onPress={() => onMoveGalleryPhoto(photo.id, 'up')} disabled={index === 0} accessibilityRole="button" accessibilityLabel="Move earlier">
                    <Ionicons name="arrow-up" size={13} color={index === 0 ? colours.textSubtle : colours.textMuted} />
                  </Pressable>
                  <Pressable style={styles.galleryBtn} onPress={() => onMoveGalleryPhoto(photo.id, 'down')} disabled={index === sorted.length - 1} accessibilityRole="button" accessibilityLabel="Move later">
                    <Ionicons name="arrow-down" size={13} color={index === sorted.length - 1 ? colours.textSubtle : colours.textMuted} />
                  </Pressable>
                  <Pressable style={[styles.galleryBtn, styles.galleryBtnDanger]} onPress={() => onRemoveGalleryPhoto(photo.id)} accessibilityRole="button" accessibilityLabel="Remove">
                    <Ionicons name="trash-outline" size={13} color={colours.error} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
        {restaurant.photos.length < MAX_GALLERY_PHOTOS
          ? <UploadBtn label={t('restaurant_add_gallery')} onPress={onPickGalleryPhoto} isLoading={isUploadingGalleryPhoto} />
          : <Text style={styles.galleryMax}>Maximum of {MAX_GALLERY_PHOTOS} photos reached.</Text>
        }
      </PhotoSection>
    </View>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PhotoSection({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

interface PhotoBtnProps { label: string; onPress: () => void; isLoading?: boolean; danger?: boolean; }
function PhotoBtn({ label, onPress, isLoading, danger }: PhotoBtnProps): React.JSX.Element {
  return (
    <Pressable style={[styles.photoBtn, danger && styles.photoBtnDanger]} onPress={onPress} disabled={isLoading} accessibilityRole="button" accessibilityLabel={label}>
      {isLoading ? <ActivityIndicator size="small" color={danger ? colours.error : colours.primary} /> : <Text style={[styles.photoBtnText, danger && styles.photoBtnTextDanger]}>{label}</Text>}
    </Pressable>
  );
}

interface UploadBtnProps { label: string; onPress: () => Promise<void>; isLoading: boolean; }
function UploadBtn({ label, onPress, isLoading }: UploadBtnProps): React.JSX.Element {
  return (
    <Pressable style={styles.uploadBtn} onPress={onPress} disabled={isLoading} accessibilityRole="button" accessibilityLabel={label}>
      {isLoading ? <ActivityIndicator size="small" color={colours.primary} /> : <><Ionicons name="image-outline" size={16} color={colours.primary} /><Text style={styles.uploadBtnText}>{label}</Text></>}
    </Pressable>
  );
}
