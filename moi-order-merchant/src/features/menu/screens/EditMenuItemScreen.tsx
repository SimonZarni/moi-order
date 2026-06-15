import React, { useState, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, TextInput,
  ActivityIndicator, Image, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './EditMenuItemScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useEditMenuItemScreen } from '../hooks/useEditMenuItemScreen';
import type { AddItemForm } from '../hooks/useMenuScreen';
import type { StyleProp, TextStyle } from 'react-native';

interface EditMenuItemScreenProps {
  itemId: number;
  onBack: () => void;
}

export function EditMenuItemScreen({ itemId, onBack }: EditMenuItemScreenProps): React.JSX.Element {
  const {
    item, isLoading, form, existingPhotoUrl, isSaving, canSubmit,
    customerPriceCents, customerOriginalPriceCents, discountCents,
    handleFieldChange, handlePhotoChange, handlePickPhoto,
    handleAddOptionGroup, handleRemoveOptionGroup, handleOptionGroupChange,
    handleAddOption, handleRemoveOption, handleOptionChange,
    handleSubmit,
  } = useEditMenuItemScreen({ itemId, onBack });

  if (isLoading && !item) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnLight} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Edit Item</Text>
          {item && <Text style={styles.headerSubtitle} numberOfLines={1}>{item.name}</Text>}
        </View>
        <Pressable
          style={[styles.saveBtn, !canSubmit && styles.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityLabel="Save changes"
          accessibilityRole="button"
        >
          {isSaving
            ? <ActivityIndicator size="small" color={colours.surface} />
            : <Text style={styles.saveBtnText}>Save Changes</Text>
          }
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* ── Photo ───────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Photo</Text>
          <PhotoSection
            newPhoto={form.photo}
            existingUrl={existingPhotoUrl}
            onPickPhoto={handlePickPhoto}
          />
        </View>

        {/* ── Details ─────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Item Details</Text>

          <View>
            <Text style={styles.fieldLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(v) => handleFieldChange('name', v)}
              placeholder="Item name"
              placeholderTextColor={colours.textSubtle}
              accessibilityLabel="Item name"
            />
          </View>

          <View>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={form.description}
              onChangeText={(v) => handleFieldChange('description', v)}
              placeholder="Describe this item (optional)"
              placeholderTextColor={colours.textSubtle}
              multiline
              accessibilityLabel="Item description"
            />
          </View>
        </View>

        {/* ── Pricing ─────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Pricing</Text>

          <View style={styles.priceRow}>
            {/* Net price */}
            <View style={styles.priceCol}>
              <Text style={styles.fieldLabel}>Your net price *</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(v) => handleFieldChange('price', v)}
                placeholder="0.00"
                placeholderTextColor={colours.textSubtle}
                keyboardType="decimal-pad"
                accessibilityLabel="Net price"
              />
              {customerPriceCents > 0 && (
                <View style={styles.customerSeesRow}>
                  <Text style={styles.customerSeesLabel}>Customer pays</Text>
                  <Text style={styles.customerSeesValue}>{formatPrice(customerPriceCents)}</Text>
                </View>
              )}
            </View>

            {/* Crossed-out price */}
            <View style={styles.priceCol}>
              <Text style={styles.fieldLabel}>Crossed-out price</Text>
              <TextInput
                style={styles.input}
                value={form.original_price}
                onChangeText={(v) => handleFieldChange('original_price', v)}
                placeholder="Optional"
                placeholderTextColor={colours.textSubtle}
                keyboardType="decimal-pad"
                accessibilityLabel="Original price before discount"
              />
              {customerOriginalPriceCents !== null && customerOriginalPriceCents > 0 && (
                <View style={styles.customerSeesRow}>
                  <Text style={styles.customerSeesLabel}>Was</Text>
                  <Text style={[styles.customerSeesValue, { color: colours.textSubtle, textDecorationLine: 'line-through' }]}>
                    {formatPrice(customerOriginalPriceCents)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {discountCents > 0 && (
            <View style={styles.discountBadge}>
              <Ionicons name="pricetag" size={12} color={colours.success} />
              <Text style={styles.discountText}>
                Customers save {formatPrice(discountCents)}
              </Text>
            </View>
          )}
        </View>

        {/* ── Options ─────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Option Groups</Text>
          <Text style={[styles.fieldLabel, { marginBottom: 0 }]}>
            e.g. Protein → Pork, Beef, Chicken (+price)
          </Text>

          {form.option_groups.map((group, gi) => (
            <OptionGroupCard
              key={gi}
              group={group}
              groupIndex={gi}
              onGroupChange={handleOptionGroupChange}
              onRemoveGroup={handleRemoveOptionGroup}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
              onOptionChange={handleOptionChange}
            />
          ))}

          <Pressable
            style={styles.addGroupBtn}
            onPress={handleAddOptionGroup}
            accessibilityLabel="Add option group"
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={15} color={colours.primary} />
            <Text style={styles.addGroupBtnText}>Add Option Group</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface PhotoSectionProps {
  newPhoto: AddItemForm['photo'];
  existingUrl: string | null;
  onPickPhoto: () => void;
}

function PhotoSection({ newPhoto, existingUrl, onPickPhoto }: PhotoSectionProps): React.JSX.Element {
  const [loadError, setLoadError] = useState(false);
  const uri = newPhoto !== null ? newPhoto.uri : existingUrl;
  const handleError = useCallback(() => setLoadError(true), []);

  if (uri === null || loadError) {
    return (
      <Pressable style={styles.noPhoto} onPress={onPickPhoto} accessibilityRole="button" accessibilityLabel="Add photo">
        <Ionicons name="image-outline" size={28} color={colours.textSubtle} />
        <Text style={styles.noPhotoText}>Tap to add a photo</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.photoWrap}>
      <Image source={{ uri }} style={styles.photo} resizeMode="cover" onError={handleError} accessibilityLabel="Item photo" />
      {newPhoto !== null && (
        <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
      )}
      <Pressable style={[styles.changePhotoBtn, { marginTop: 8 }]} onPress={onPickPhoto} accessibilityRole="button" accessibilityLabel="Change photo">
        <Ionicons name="image-outline" size={14} color={colours.primary} />
        <Text style={styles.changePhotoBtnText}>Change Photo</Text>
      </Pressable>
    </View>
  );
}

interface OptionGroupCardProps {
  group: AddItemForm['option_groups'][number];
  groupIndex: number;
  onGroupChange: (gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
  onRemoveGroup: (gi: number) => void;
  onAddOption: (gi: number) => void;
  onRemoveOption: (gi: number, oi: number) => void;
  onOptionChange: (gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
}

function OptionGroupCard({ group, groupIndex: gi, onGroupChange, onRemoveGroup, onAddOption, onRemoveOption, onOptionChange }: OptionGroupCardProps): React.JSX.Element {
  return (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={group.name}
          onChangeText={(v) => onGroupChange(gi, 'name', v)}
          placeholder="Group name (e.g. Protein)"
          placeholderTextColor={colours.textSubtle}
          accessibilityLabel={`Option group ${gi + 1} name`}
        />
        <Pressable style={styles.iconBtn} onPress={() => onRemoveGroup(gi)} accessibilityRole="button" accessibilityLabel="Remove group">
          <Ionicons name="trash-outline" size={17} color={colours.error} />
        </Pressable>
      </View>

      <View style={styles.groupMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Required</Text>
          <Switch
            value={group.is_required}
            onValueChange={(v) => onGroupChange(gi, 'is_required', v)}
            trackColor={{ false: colours.divider, true: colours.primary + '66' }}
            thumbColor={group.is_required ? colours.primary : colours.medium}
            accessibilityLabel={`Group ${gi + 1} required`}
          />
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Min</Text>
          <NumericInput
            value={group.min_selections}
            min={0} max={10} fallback={0}
            style={styles.numInput}
            onChange={(n) => onGroupChange(gi, 'min_selections', n)}
            accessibilityLabel={`Min selections for group ${gi + 1}`}
          />
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Max</Text>
          <NumericInput
            value={group.max_selections}
            min={1} max={10} fallback={1}
            style={styles.numInput}
            onChange={(n) => onGroupChange(gi, 'max_selections', n)}
            accessibilityLabel={`Max selections for group ${gi + 1}`}
          />
        </View>
      </View>

      {group.options.map((opt, oi) => (
        <View key={oi} style={styles.optionRow}>
          <TextInput
            style={[styles.input, styles.optionNameInput, { marginBottom: 0 }]}
            value={opt.name}
            onChangeText={(v) => onOptionChange(gi, oi, 'name', v)}
            placeholder="Option name"
            placeholderTextColor={colours.textSubtle}
            accessibilityLabel={`Option ${oi + 1} name`}
          />
          <TextInput
            style={[styles.input, styles.optionPriceInput, { marginBottom: 0 }]}
            value={opt.additional_price_cents === 0 ? '' : String(opt.additional_price_cents / 100)}
            onChangeText={(v) => onOptionChange(gi, oi, 'additional_price_cents', Math.round(parseFloat(v || '0') * 100))}
            placeholder="+0 ฿"
            placeholderTextColor={colours.textSubtle}
            keyboardType="decimal-pad"
            accessibilityLabel={`Option ${oi + 1} additional price`}
          />
          <Pressable style={styles.iconBtn} onPress={() => onRemoveOption(gi, oi)} accessibilityRole="button" accessibilityLabel="Remove option">
            <Ionicons name="close-circle-outline" size={17} color={colours.error} />
          </Pressable>
        </View>
      ))}

      <Pressable style={styles.addOptionBtn} onPress={() => onAddOption(gi)} accessibilityRole="button" accessibilityLabel="Add option">
        <Ionicons name="add-outline" size={13} color={colours.primary} />
        <Text style={styles.addOptionText}>Add Option</Text>
      </Pressable>
    </View>
  );
}

interface NumericInputProps {
  value: number;
  min: number;
  max: number;
  fallback: number;
  style: StyleProp<TextStyle>;
  onChange: (n: number) => void;
  accessibilityLabel: string;
}

function NumericInput({ value, min, max, fallback, style, onChange, accessibilityLabel }: NumericInputProps): React.JSX.Element {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft !== null ? draft : String(value);
  return (
    <TextInput
      style={style}
      value={display}
      onFocus={() => setDraft(String(value))}
      onChangeText={setDraft}
      onBlur={() => {
        const parsed = parseInt(draft ?? '', 10);
        const clamped = isNaN(parsed) ? fallback : Math.min(max, Math.max(min, parsed));
        setDraft(null);
        onChange(clamped);
      }}
      selectTextOnFocus
      keyboardType="number-pad"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
