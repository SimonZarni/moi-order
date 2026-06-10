import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { MenuItemOptionGroup } from '@/types/models';
import { useStrings, AppStrings } from '@/shared/i18n';
import { useMenuItemDetailScreen } from '../hooks/useMenuItemDetailScreen';
import { styles } from './MenuItemDetailScreen.styles';

function groupMetaLabel(group: MenuItemOptionGroup, r: AppStrings['restaurant']): string {
  if (group.is_required) {
    return group.min_selections > 1
      ? `${r.required} · ${r.chooseAtLeast.replace('{n}', String(group.min_selections))}`
      : `${r.required} · ${r.chooseOne}`;
  }
  return `${r.optional} · ${r.chooseUpTo.replace('{n}', String(group.max_selections))}`;
}

export function MenuItemDetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const s      = useStrings();
  const {
    item, selections, quantity, note, isValid, totalCents,
    handleBack, handleSelectOption, handleQuantityChange, handleNoteChange, handleAddToCart,
  } = useMenuItemDetailScreen();

  if (!item) return <SafeAreaView style={styles.root} edges={['top']}><ActivityIndicator color={colours.primary} style={{ marginTop: 80 }} /></SafeAreaView>;

  const isDiscounted = item.original_price_cents !== null && item.original_price_cents > item.price_cents;

  return (
    <SafeAreaView style={styles.root} edges={[]}>
      <Pressable style={[styles.backBtn, { top: insets.top + 8, left: 16 }]} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={22} color={colours.white} />
      </Pressable>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={item.photo_url ? { uri: item.photo_url } : null} style={styles.photo} contentFit="cover" transition={200} />

        <View style={styles.infoBlock}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.priceRow}>
            {isDiscounted && <Text style={styles.originalPrice}>{formatPrice(item.original_price_cents! / 100)}</Text>}
            <Text style={styles.price}>{formatPrice(item.price_cents / 100)}</Text>
          </View>
          {item.description !== null && <Text style={styles.description}>{item.description}</Text>}
        </View>

        {item.option_groups.map((group) => (
          <View key={group.id} style={styles.groupBlock}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={[styles.groupMeta, group.is_required ? styles.groupMetaRequired : styles.groupMetaOptional]}>
                {groupMetaLabel(group, s.restaurant)}
              </Text>
            </View>
            {group.options.map((opt) => {
              const isSelected = (selections[group.id] ?? []).includes(opt.id);
              const isRadio    = group.max_selections === 1;
              return (
                <Pressable
                  key={opt.id}
                  style={styles.optionRow}
                  onPress={() => handleSelectOption(group.id, opt.id, group.max_selections)}
                  accessibilityRole="radio"
                  accessibilityLabel={opt.name}
                  accessibilityState={{ checked: isSelected }}
                >
                  <View style={[styles.selector, !isRadio && styles.selectorSquare, isSelected && styles.selectorActive]}>
                    {isSelected && (isRadio
                      ? <View style={styles.selectorDot} />
                      : <Ionicons name="checkmark" size={14} color={colours.white} />
                    )}
                  </View>
                  <Text style={styles.optionLabel}>{opt.name}</Text>
                  {opt.additional_price_cents > 0 && (
                    <Text style={styles.optionPrice}>+{formatPrice(opt.additional_price_cents / 100)}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}

        <View style={styles.noteBlock}>
          <Text style={styles.noteLabel}>{s.restaurant.specialInstructions}</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={handleNoteChange}
            placeholder={s.restaurant.instructionsPlaceholder}
            placeholderTextColor={colours.textMuted}
            multiline
            accessibilityLabel="Special instructions"
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.quantityRow}>
          <Pressable style={[styles.qtyBtn, quantity > 1 && styles.qtyBtnActive]} onPress={() => handleQuantityChange(-1)} accessibilityRole="button" accessibilityLabel="Decrease quantity">
            <Text style={[styles.qtyBtnText, quantity > 1 && styles.qtyBtnTextActive]}>−</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Pressable style={[styles.qtyBtn, styles.qtyBtnActive]} onPress={() => handleQuantityChange(1)} accessibilityRole="button" accessibilityLabel="Increase quantity">
            <Text style={[styles.qtyBtnText, styles.qtyBtnTextActive]}>+</Text>
          </Pressable>
        </View>
        <Pressable style={[styles.addBtn, !isValid && styles.addBtnDisabled]} onPress={handleAddToCart} disabled={!isValid} accessibilityRole="button" accessibilityLabel="Add to cart">
          <Text style={styles.addBtnText}>{s.restaurant.addToCart} · {formatPrice(totalCents / 100)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
