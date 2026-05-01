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
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={handleUploadCover} style={styles.coverPhotoContainer}
          accessibilityLabel="Change restaurant cover photo" accessibilityRole="button">
          {restaurant?.cover_photo_url
            ? <Image source={{ uri: restaurant.cover_photo_url }} style={styles.coverPhoto} />
            : <View style={styles.coverPhotoPlaceholder}>
                <Ionicons name="image-outline" size={40} color={colours.medium} />
                <Text style={styles.uploadHint}>Tap to upload cover photo</Text>
              </View>}
        </Pressable>

        <Pressable onPress={handleUploadLogo} style={styles.logoContainer}
          accessibilityLabel="Change restaurant logo" accessibilityRole="button">
          {restaurant?.logo_url
            ? <Image source={{ uri: restaurant.logo_url }} style={styles.logo} />
            : <View style={styles.logoPlaceholder}>
                <Ionicons name="storefront-outline" size={32} color={colours.medium} />
              </View>}
        </Pressable>

        {restaurant && (
          <View style={styles.section}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.description !== null && <Text style={styles.description}>{restaurant.description}</Text>}
            {restaurant.address !== null && <Text style={styles.address}>{restaurant.address}</Text>}
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{restaurant.status}</Text>
            </View>
          </View>
        )}

        {user && (
          <View style={styles.accountSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Text style={styles.accountName}>{user.name}</Text>
            <Text style={styles.accountEmail}>{user.email}</Text>
            {user.phone !== null && <Text style={styles.accountPhone}>{user.phone}</Text>}
          </View>
        )}

        <Pressable style={styles.logoutButton} onPress={handleLogout}
          accessibilityLabel="Log out of merchant account" accessibilityRole="button">
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
