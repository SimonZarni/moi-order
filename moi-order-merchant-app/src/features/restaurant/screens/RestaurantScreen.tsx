import React from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurantScreen } from '../hooks/useRestaurantScreen';
import { styles } from './RestaurantScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { RESTAURANT_STATUS } from '../../../types/enums';
import type { RestaurantStatus } from '../../../types/enums';

const STATUS_CONFIG: Record<RestaurantStatus, { label: string; color: string; bg: string }> = {
  [RESTAURANT_STATUS.Open]:   { label: 'Open',   color: colours.success,     bg: colours.successBg },
  [RESTAURANT_STATUS.Closed]: { label: 'Closed', color: colours.error,       bg: colours.errorBg },
  [RESTAURANT_STATUS.Paused]: { label: 'Paused', color: colours.warning,     bg: colours.warningBg },
};

export function RestaurantScreen(): React.JSX.Element {
  const {
    restaurant, isLoading, isEditing, isSaving,
    form, handleStartEdit, handleCancelEdit,
    handleFieldChange, handleSave, handleToggleStatus,
  } = useRestaurantScreen();

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
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
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
                  accessibilityLabel={`Set status to ${cfg.label}`}
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

        {isEditing ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Edit Profile</Text>

            <View>
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

            <View>
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

            <View>
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

            <View>
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
            <Text style={styles.cardTitle}>Profile</Text>
            <InfoRow label="Name" value={restaurant?.name ?? '—'} />
            <View style={styles.divider} />
            <InfoRow label="Description" value={restaurant?.description ?? '—'} />
            <View style={styles.divider} />
            <InfoRow label="Address" value={restaurant?.address ?? '—'} />
            <View style={styles.divider} />
            <InfoRow label="Phone" value={restaurant?.phone ?? '—'} />
          </View>
        )}

        {restaurant !== undefined && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Settings</Text>
            <InfoRow
              label="Delivery"
              value={restaurant.is_delivery_available ? 'Available' : 'Not available'}
            />
            <View style={styles.divider} />
            <InfoRow
              label="Pickup"
              value={restaurant.is_pickup_available ? 'Available' : 'Not available'}
            />
            <View style={styles.divider} />
            <InfoRow
              label="Min Order"
              value={formatPrice(restaurant.min_order_cents)}
            />
            {restaurant.delivery_radius_km !== null && (
              <>
                <View style={styles.divider} />
                <InfoRow
                  label="Radius"
                  value={`${restaurant.delivery_radius_km} km`}
                />
              </>
            )}
          </View>
        )}
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
