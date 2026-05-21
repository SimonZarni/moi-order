import React from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileScreen } from '../hooks/useProfileScreen';
import { styles } from './ProfileScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { Ionicons } from '@expo/vector-icons';

export function ProfileScreen(): React.JSX.Element {
  const {
    restaurant, user, isLoading,
    handleLogout, handleUploadCover, handleUploadLogo,
  } = useProfileScreen();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Cover photo hero ── */}
        <Pressable onPress={handleUploadCover} style={styles.coverPhotoContainer} accessibilityLabel="Change cover photo" accessibilityRole="button">
          {restaurant?.cover_photo_url
            ? <Image source={{ uri: restaurant.cover_photo_url }} style={styles.coverPhoto} />
            : <View style={styles.coverPhotoPlaceholder}>
                <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.3)" />
                <Text style={styles.uploadHint}>Add cover photo</Text>
              </View>}
          <View style={styles.coverEditBadge}>
            <Ionicons name="camera-outline" size={12} color={colours.white} />
          </View>
        </Pressable>

        {/* ── Logo + restaurant name ── */}
        <View style={styles.identityRow}>
          <Pressable onPress={handleUploadLogo} style={styles.logoContainer} accessibilityLabel="Change logo" accessibilityRole="button">
            {restaurant?.logo_url
              ? <Image source={{ uri: restaurant.logo_url }} style={styles.logo} />
              : <View style={styles.logoPlaceholder}>
                  <Ionicons name="storefront-outline" size={28} color="rgba(255,255,255,0.5)" />
                </View>}
            <View style={styles.logoEditBadge}>
              <Ionicons name="camera-outline" size={10} color={colours.white} />
            </View>
          </Pressable>

          {restaurant && (
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
              {restaurant.address !== null && (
                <View style={styles.addressRow}>
                  <Ionicons name="location-outline" size={12} color={colours.textMuted} />
                  <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
                </View>
              )}
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{restaurant.status}</Text>
              </View>
            </View>
          )}
        </View>

        {restaurant?.description !== null && restaurant?.description !== undefined && (
          <Text style={styles.description}>{restaurant.description}</Text>
        )}

        {/* ── Account section ── */}
        {user && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.accountCard}>
              <View style={styles.accountRow}>
                <View style={[styles.accountIcon, { backgroundColor: colours.primaryGlow }]}>
                  <Ionicons name="person-outline" size={16} color={colours.primary} />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountLabel}>Name</Text>
                  <Text style={styles.accountValue}>{user.name}</Text>
                </View>
              </View>
              <View style={styles.rowDivider} />
              <View style={styles.accountRow}>
                <View style={[styles.accountIcon, { backgroundColor: colours.infoBg }]}>
                  <Ionicons name="mail-outline" size={16} color={colours.info} />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountLabel}>Email</Text>
                  <Text style={styles.accountValue}>{user.email ?? '—'}</Text>
                </View>
              </View>
              {user.phone !== null && (
                <>
                  <View style={styles.rowDivider} />
                  <View style={styles.accountRow}>
                    <View style={[styles.accountIcon, { backgroundColor: colours.successBg }]}>
                      <Ionicons name="call-outline" size={16} color={colours.success} />
                    </View>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountLabel}>Phone</Text>
                      <Text style={styles.accountValue}>{user.phone}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* ── Logout ── */}
        <View style={styles.sectionBlock}>
          <Pressable style={styles.logoutButton} onPress={handleLogout} accessibilityLabel="Log out of merchant account" accessibilityRole="button">
            <Ionicons name="log-out-outline" size={18} color={colours.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
