import React from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileScreen } from '../hooks/useProfileScreen';
import { styles } from './ProfileScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface AccountRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}

function AccountRow({ icon, iconBg, iconColor, label, value }: AccountRowProps): React.JSX.Element {
  return (
    <View style={styles.accountRow}>
      <View style={[styles.accountRowIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={styles.accountRowText}>
        <Text style={styles.accountRowLabel}>{label}</Text>
        <Text style={styles.accountRowValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen(): React.JSX.Element {
  const t = useTranslation();
  const { restaurant, user, isLoading, handleLogout, handleUploadCover, handleUploadLogo, handleNavigateToBusinessProfile, handleNavigateToSettings } = useProfileScreen();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Cover photo ── */}
        <Pressable onPress={handleUploadCover} style={styles.cover} accessibilityLabel="Change cover photo" accessibilityRole="button">
          {restaurant?.cover_photo_url
            ? <Image source={{ uri: restaurant.cover_photo_url }} style={styles.coverImage} />
            : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={36} color="rgba(255,255,255,0.25)" />
                <Text style={styles.coverHint}>{t('profile_cover_hint')}</Text>
              </View>
            )}
          <View style={styles.coverEditBtn}>
            <Ionicons name="camera" size={14} color={colours.white} />
          </View>
        </Pressable>

        {/* ── Logo + info (overlaps cover) ── */}
        <View style={styles.identityBlock}>
          <Pressable onPress={handleUploadLogo} style={styles.logoWrap} accessibilityLabel="Change logo" accessibilityRole="button">
            {restaurant?.logo_url
              ? <Image source={{ uri: restaurant.logo_url }} style={styles.logo} />
              : (
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="storefront-outline" size={30} color="rgba(255,255,255,0.5)" />
                </View>
              )}
            <View style={styles.logoCameraBtn}>
              <Ionicons name="camera" size={11} color={colours.white} />
            </View>
          </Pressable>

          <View style={styles.restaurantMeta}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant?.name ?? t('profile_your_restaurant')}
            </Text>
            {restaurant?.address !== null && restaurant?.address !== undefined && (
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.4)" />
                <Text style={styles.addressText} numberOfLines={1}>{restaurant.address}</Text>
              </View>
            )}
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{restaurant?.status ?? 'inactive'}</Text>
            </View>
          </View>
        </View>

        {restaurant?.description !== null && restaurant?.description !== undefined && (
          <Text style={styles.description}>{restaurant.description}</Text>
        )}

        {/* ── Account info ── */}
        {user !== null && user !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('profile_account')}</Text>
            <View style={styles.card}>
              <AccountRow icon="person-outline" iconBg={colours.primary + '22'} iconColor={colours.primary} label={t('profile_name')} value={user.name} />
              <View style={styles.rowSep} />
              <AccountRow icon="mail-outline" iconBg={colours.info + '22'} iconColor={colours.info} label={t('profile_email')} value={user.email ?? '—'} />
              {user.phone !== null && (
                <>
                  <View style={styles.rowSep} />
                  <AccountRow icon="call-outline" iconBg={colours.success + '22'} iconColor={colours.success} label={t('profile_phone')} value={user.phone} />
                </>
              )}
            </View>
          </View>
        )}

        {/* ── Business Profile ── */}
        {user?.is_merchant === true && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('profile_business')}</Text>
            <Pressable
              style={styles.menuRow}
              onPress={handleNavigateToBusinessProfile}
              accessibilityLabel="View business profile"
              accessibilityRole="button"
            >
              <View style={[styles.accountRowIcon, { backgroundColor: colours.primary + '22' }]}>
                <Ionicons name="briefcase-outline" size={16} color={colours.primary} />
              </View>
              <Text style={styles.menuRowLabel}>{t('profile_business_profile')}</Text>
              <Ionicons name="chevron-forward" size={16} color={colours.textSubtle} />
            </Pressable>
          </View>
        )}

        {/* ── Settings ── */}
        <View style={styles.section}>
          <Pressable
            style={styles.menuRow}
            onPress={handleNavigateToSettings}
            accessibilityLabel="Open settings"
            accessibilityRole="button"
          >
            <View style={[styles.accountRowIcon, { backgroundColor: colours.textMuted + '22' }]}>
              <Ionicons name="settings-outline" size={16} color={colours.textMuted} />
            </View>
            <Text style={styles.menuRowLabel}>{t('profile_settings')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colours.textSubtle} />
          </Pressable>
        </View>

        {/* ── Logout ── */}
        <View style={styles.section}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout} accessibilityLabel="Log out" accessibilityRole="button">
            <Ionicons name="log-out-outline" size={20} color={colours.error} />
            <Text style={styles.logoutText}>{t('profile_sign_out')}</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
