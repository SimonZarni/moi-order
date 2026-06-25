import React from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './RestaurantProfileCard.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { Restaurant } from '../../../types/models';

interface RestaurantProfileCardProps {
  restaurant: Restaurant | null;
  isEditing: boolean;
  isSaving: boolean;
  descriptionForm: { description: string };
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDescriptionChange: (v: string) => void;
  onSave: () => void;
  isEditingPhone: boolean;
  phoneInput: string;
  onEditPhone: () => void;
  onCancelPhone: () => void;
  onPhoneChange: (v: string) => void;
  onSavePhone: () => void;
  isEditingLocation: boolean;
  locationInput: { latitude: number | null; longitude: number | null };
  isLocating: boolean;
  locationError: string | null;
  onEditLocation: () => void;
  onCancelLocation: () => void;
  onGetLocation: () => void;
  onClearLocation: () => void;
  onSaveLocation: () => void;
  onOpenResubmit: () => void;
}

export function RestaurantProfileCard({
  restaurant, isEditing, isSaving, descriptionForm,
  onStartEdit, onCancelEdit, onDescriptionChange, onSave,
  isEditingPhone, phoneInput, onEditPhone, onCancelPhone, onPhoneChange, onSavePhone,
  isEditingLocation, locationInput, isLocating, locationError,
  onEditLocation, onCancelLocation, onGetLocation, onClearLocation, onSaveLocation,
  onOpenResubmit,
}: RestaurantProfileCardProps): React.JSX.Element {
  const t = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{t('restaurant_profile_card')}</Text>
        {!isEditing && restaurant !== null && (
          <Pressable style={styles.editBtn} onPress={onStartEdit} accessibilityRole="button" accessibilityLabel="Edit description">
            <Ionicons name="pencil-outline" size={12} color={colours.primaryDark} />
            <Text style={styles.editBtnText}>{t('restaurant_edit_description')}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.body}>
        <InfoRow label={t('restaurant_name_label')} value={restaurant?.name ?? '—'} />
        <View style={styles.divider} />
        <InfoRow label={t('restaurant_address_label')} value={restaurant?.address ?? '—'} />
        <View style={styles.divider} />

        {/* GPS */}
        {isEditingLocation ? (
          <LocationEditor
            locationInput={locationInput} isLocating={isLocating} locationError={locationError}
            isSaving={isSaving} t={t} onGetLocation={onGetLocation} onClearLocation={onClearLocation}
            onCancel={onCancelLocation} onSave={onSaveLocation}
          />
        ) : (
          <RowWithEdit label="GPS" value={restaurant?.latitude != null ? `${restaurant.latitude.toFixed(5)}, ${restaurant.longitude?.toFixed(5)}` : '—'} onEdit={restaurant !== null ? onEditLocation : undefined} />
        )}
        <View style={styles.divider} />

        {/* Phone */}
        {isEditingPhone ? (
          <InlineTextEdit label={t('restaurant_phone_label')} value={phoneInput} placeholder="+66 xx xxx xxxx" keyboardType="phone-pad" isSaving={isSaving} onChange={onPhoneChange} onCancel={onCancelPhone} onSave={onSavePhone} t={t} />
        ) : (
          <RowWithEdit label={t('restaurant_phone_label')} value={restaurant?.phone ?? '—'} onEdit={restaurant !== null ? onEditPhone : undefined} />
        )}
        <View style={styles.divider} />

        {/* Description */}
        {isEditing ? (
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{t('restaurant_description_label')}</Text>
            <TextInput style={[styles.input, styles.inputMultiline]} value={descriptionForm.description} onChangeText={onDescriptionChange} placeholder={t('restaurant_description_placeholder')} placeholderTextColor={colours.textSubtle} multiline numberOfLines={3} accessibilityLabel="Restaurant description" />
            <FormActions isSaving={isSaving} onCancel={onCancelEdit} onSave={onSave} t={t} />
          </View>
        ) : (
          <InfoRow label={t('restaurant_description_label')} value={restaurant?.description ?? '—'} />
        )}
      </View>

      {restaurant !== null && (
        <View style={styles.kycNote}>
          <Text style={styles.kycNoteText}>{t('restaurant_kyc_note')} </Text>
          <Pressable onPress={onOpenResubmit} accessibilityRole="button" accessibilityLabel="Request change">
            <Text style={styles.kycNoteLink}>{t('restaurant_request_change')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

interface RowWithEditProps { label: string; value: string; onEdit?: () => void; }
function RowWithEdit({ label, value, onEdit }: RowWithEditProps): React.JSX.Element {
  return (
    <View style={styles.infoRowAction}>
      <View style={styles.infoRowFlex}><InfoRow label={label} value={value} /></View>
      {onEdit !== undefined && (
        <Pressable style={styles.inlineEditBtn} onPress={onEdit} accessibilityRole="button" accessibilityLabel={`Edit ${label}`}>
          <Ionicons name="pencil-outline" size={13} color={colours.primary} />
        </Pressable>
      )}
    </View>
  );
}

type TFn = ReturnType<typeof useTranslation>;

interface InlineTextEditProps { label: string; value: string; placeholder: string; keyboardType?: 'phone-pad' | 'default'; isSaving: boolean; onChange: (v: string) => void; onCancel: () => void; onSave: () => void; t: TFn; }
function InlineTextEdit({ label, value, placeholder, keyboardType = 'default', isSaving, onChange, onCancel, onSave, t }: InlineTextEditProps): React.JSX.Element {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colours.textSubtle} keyboardType={keyboardType} accessibilityLabel={label} />
      <FormActions isSaving={isSaving} onCancel={onCancel} onSave={onSave} t={t} />
    </View>
  );
}

interface LocationEditorProps { locationInput: { latitude: number | null; longitude: number | null }; isLocating: boolean; locationError: string | null; isSaving: boolean; t: TFn; onGetLocation: () => void; onClearLocation: () => void; onCancel: () => void; onSave: () => void; }
function LocationEditor({ locationInput, isLocating, locationError, isSaving, t, onGetLocation, onClearLocation, onCancel, onSave }: LocationEditorProps): React.JSX.Element {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>GPS Location</Text>
      {locationInput.latitude !== null
        ? <View style={styles.locationPreview}><Ionicons name="location-outline" size={13} color={colours.primary} /><Text style={styles.locationPreviewText}>{locationInput.latitude.toFixed(6)}, {locationInput.longitude?.toFixed(6)}</Text></View>
        : <Text style={styles.locationEmpty}>No location set — tap below to get GPS coordinates.</Text>
      }
      {locationError !== null && <Text style={styles.locationError}>{locationError}</Text>}
      <View style={styles.locationActions}>
        <Pressable style={styles.locationGetBtn} onPress={onGetLocation} disabled={isLocating} accessibilityRole="button" accessibilityLabel="Get current location">
          {isLocating ? <ActivityIndicator size="small" color={colours.primary} /> : <><Ionicons name="navigate-outline" size={14} color={colours.primary} /><Text style={styles.locationGetBtnText}>Use Current Location</Text></>}
        </Pressable>
        {locationInput.latitude !== null && <Pressable style={styles.locationClearBtn} onPress={onClearLocation} accessibilityRole="button" accessibilityLabel="Clear location"><Text style={styles.locationClearBtnText}>Clear</Text></Pressable>}
      </View>
      <FormActions isSaving={isSaving} onCancel={onCancel} onSave={onSave} t={t} />
    </View>
  );
}

interface FormActionsProps { isSaving: boolean; onCancel: () => void; onSave: () => void; t: TFn; }
function FormActions({ isSaving, onCancel, onSave, t }: FormActionsProps): React.JSX.Element {
  return (
    <View style={styles.formActions}>
      <Pressable style={styles.cancelBtn} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel"><Text style={styles.cancelBtnText}>{t('common_cancel')}</Text></Pressable>
      <Pressable style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} onPress={onSave} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save">
        <Text style={styles.saveBtnText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
      </Pressable>
    </View>
  );
}
