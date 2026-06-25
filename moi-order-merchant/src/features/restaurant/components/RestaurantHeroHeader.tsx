import React from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './RestaurantHeroHeader.styles';
import { colours } from '../../../shared/theme/colours';
import { RESTAURANT_STATUS } from '../../../types/enums';
import type { Restaurant } from '../../../types/models';
import type { RestaurantStatus } from '../../../types/enums';
import { useTranslation } from '../../../shared/hooks/useTranslation';

const STATUS_CONFIG: Record<RestaurantStatus, { label: string; color: string; bg: string; border: string }> = {
  [RESTAURANT_STATUS.Open]:   { label: 'Open',   color: colours.success,  bg: '#dcfce7', border: colours.success + '66' },
  [RESTAURANT_STATUS.Closed]: { label: 'Closed', color: colours.error,    bg: '#fee2e2', border: colours.error + '66' },
  [RESTAURANT_STATUS.Paused]: { label: 'Paused', color: colours.warning,  bg: '#fef9c3', border: colours.warning + '66' },
};

interface RestaurantHeroHeaderProps {
  restaurant: Restaurant;
  isTogglingStatus: boolean;
  overrideActive: boolean;
  overrideUntil: string | null;
  statusWarning: string | null;
  onToggleStatus: (status: RestaurantStatus) => void;
  onDismissWarning: () => void;
  onPickCoverPhoto: () => Promise<void>;
  isUploadingCover: boolean;
}

export function RestaurantHeroHeader({
  restaurant, isTogglingStatus, overrideActive, overrideUntil, statusWarning,
  onToggleStatus, onDismissWarning, onPickCoverPhoto, isUploadingCover,
}: RestaurantHeroHeaderProps): React.JSX.Element {
  const t = useTranslation();
  const currentStatus = restaurant.status as RestaurantStatus;
  const statusCfg = STATUS_CONFIG[currentStatus];

  return (
    <View style={styles.hero}>
      {/* Cover photo */}
      <Pressable style={styles.coverWrap} onPress={onPickCoverPhoto} accessibilityRole="button" accessibilityLabel="Change cover photo">
        {restaurant.cover_photo_url != null
          ? <Image source={{ uri: restaurant.cover_photo_url }} style={styles.cover} resizeMode="cover" />
          : <View style={styles.coverPlaceholder}><Ionicons name="image-outline" size={28} color={colours.textSubtle} /><Text style={styles.coverPlaceholderText}>{t('restaurant_upload_cover')}</Text></View>
        }
        {isUploadingCover && <View style={styles.coverOverlay}><ActivityIndicator size="small" color={colours.surface} /></View>}
        <View style={styles.coverEditBadge}><Ionicons name="camera-outline" size={13} color={colours.surface} /></View>
      </Pressable>

      {/* Name + status row */}
      <View style={styles.nameRow}>
        {restaurant.logo_url != null
          ? <Image source={{ uri: restaurant.logo_url }} style={styles.logo} resizeMode="cover" />
          : <View style={styles.logoPlaceholder}><Ionicons name="storefront-outline" size={20} color={colours.textSubtle} /></View>
        }
        <View style={styles.nameBlock}>
          <Text style={styles.restaurantName} numberOfLines={2}>{restaurant.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
            <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
            <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>
      </View>

      {/* Status warning */}
      {statusWarning !== null && (
        <View style={styles.warnBanner}>
          <Ionicons name="warning-outline" size={13} color={colours.warning} />
          <Text style={styles.warnText}>{statusWarning}</Text>
          <Pressable onPress={onDismissWarning} accessibilityRole="button" accessibilityLabel="Dismiss warning">
            <Ionicons name="close" size={15} color={colours.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Status chips */}
      <View style={styles.chipsRow}>
        {(Object.values(RESTAURANT_STATUS) as RestaurantStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const isActive = currentStatus === s;
          return (
            <Pressable key={s}
              style={[styles.chip, isActive && { backgroundColor: cfg.bg, borderColor: cfg.border }]}
              onPress={() => { if (!isTogglingStatus) onToggleStatus(s); }}
              disabled={isTogglingStatus}
              accessibilityRole="button"
              accessibilityLabel={`Set status to ${s}`}
              accessibilityState={{ selected: isActive }}
            >
              <View style={[styles.chipDot, { backgroundColor: isActive ? cfg.color : colours.medium }]} />
              <Text style={[styles.chipText, isActive && { color: cfg.color, fontWeight: '700' }]}>{cfg.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Override badge */}
      {overrideActive && overrideUntil !== null && (
        <View style={styles.overrideBadge}>
          <Ionicons name="time-outline" size={12} color={colours.primary} />
          <Text style={styles.overrideText}>
            {'Reverts to schedule at '}
            {new Date(overrideUntil).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      )}
    </View>
  );
}
